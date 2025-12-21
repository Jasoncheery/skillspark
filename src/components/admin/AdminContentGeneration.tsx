import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Play, Loader2, Copy, Check, Save, X, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { aiService } from '../../services/aiService';
import { blogService } from '../../services/blogService';
import { aiToolsService } from '../../services/aiToolsService';
import { supabase } from '../../services/supabase';
import { useToastStore } from '../../stores/toastStore';
import type { ContentGenerationJob, JobType } from '../../types/database';
import { format } from 'date-fns';

export const AdminContentGeneration = () => {
  const [blogTopic, setBlogTopic] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [toolName, setToolName] = useState('');
  const [toolInfo, setToolInfo] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedJob, setSelectedJob] = useState<ContentGenerationJob | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');
  const [saveAsBlog, setSaveAsBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [saveAsTool, setSaveAsTool] = useState(false);
  const [toolSlug, setToolSlug] = useState('');

  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['content-generation-jobs'],
    queryFn: () => contentService.getAllJobs(),
    refetchInterval: (query) => {
      // Refetch if there are pending/processing jobs
      const data = query.state.data;
      const hasActiveJobs = data?.some(
        (job: any) => job.status === 'pending' || job.status === 'processing'
      );
      return hasActiveJobs ? 3000 : false; // Poll every 3 seconds if active jobs
    },
  });

  const generateBlogMutation = useMutation({
    mutationFn: async () => {
      const prompt = `撰寫一篇關於「${blogTopic}」的詳細文章，包含介紹、功能、使用場景和總結。${blogCategory ? `類別：${blogCategory}` : ''}`;
      return await contentService.generateAndSave('blog_post', prompt);
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['content-generation-jobs'] });
      showToast('文章生成已開始，請稍候...', 'info');
      setBlogTopic('');
      setBlogCategory('');
    },
    onError: (error: any) => {
      showToast(error.message || '生成失敗', 'error');
    },
  });

  const generateToolDescriptionMutation = useMutation({
    mutationFn: async () => {
      const prompt = `為 AI 工具「${toolName}」撰寫詳細介紹，包括功能、特色、使用場景和優勢。${toolInfo ? `工具資訊：${toolInfo}` : ''}`;
      return await contentService.generateAndSave('tool_description', prompt);
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['content-generation-jobs'] });
      showToast('工具描述生成已開始，請稍候...', 'info');
      setToolName('');
      setToolInfo('');
    },
    onError: (error: any) => {
      showToast(error.message || '生成失敗', 'error');
    },
  });

  const generateImageMutation = useMutation({
    mutationFn: async () => {
      const response = await aiService.generateImage({ prompt: imagePrompt });
      if (response.success) {
        // Create job record
        return await contentService.createJob('image', imagePrompt);
      }
      throw new Error(response.error || '生成失敗');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-generation-jobs'] });
      showToast('圖片生成已開始，請稍候...', 'info');
      setImagePrompt('');
    },
    onError: (error: any) => {
      showToast(error.message || '生成失敗', 'error');
    },
  });

  const handleViewResult = (job: ContentGenerationJob) => {
    if (job.result_data) {
      const content = job.result_data.content || job.result_data.image_url || JSON.stringify(job.result_data, null, 2);
      setEditingContent(content);
      setSelectedJob(job);
      // Pre-fill based on job type
      if (job.job_type === 'blog_post') {
        setSaveAsBlog(true);
        // Extract title from prompt if possible
        const promptMatch = job.prompt.match(/關於「(.+?)」/);
        if (promptMatch) {
          setBlogTitle(promptMatch[1]);
          setBlogSlug(promptMatch[1].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        }
      } else if (job.job_type === 'tool_description') {
        setSaveAsTool(true);
        // Extract tool name from prompt
        const promptMatch = job.prompt.match(/「(.+?)」/);
        if (promptMatch) {
          setToolSlug(promptMatch[1].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        }
      }
    }
  };

  const saveBlogMutation = useMutation({
    mutationFn: async () => {
      if (!blogTitle || !blogSlug) {
        throw new Error('請填寫標題和 Slug');
      }
      const { data: { user } } = await supabase.auth.getUser();
      return await blogService.create({
        slug: blogSlug,
        title: blogTitle,
        title_chinese: null,
        content: editingContent,
        content_chinese: null,
        excerpt: editingContent.substring(0, 200),
        excerpt_chinese: null,
        cover_image_url: null,
        is_published: false, // Save as draft
        is_featured: false,
        published_at: null,
        author_id: user?.id || null,
        category: selectedJob?.target_type || null,
        tags: [],
        seo_title: null,
        seo_description: null,
        seo_keywords: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      showToast('文章已建立為草稿', 'success');
      setSaveAsBlog(false);
      setBlogTitle('');
      setBlogSlug('');
    },
    onError: (error: any) => {
      showToast(error.message || '儲存失敗', 'error');
    },
  });

  const saveToolMutation = useMutation({
    mutationFn: async () => {
      if (!toolSlug) {
        throw new Error('請填寫工具 Slug');
      }
      const tool = await aiToolsService.getBySlug(toolSlug);
      if (!tool) {
        throw new Error('工具不存在，請先建立工具');
      }
      return await aiToolsService.update(tool.id, {
        description: editingContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ai-tools'] });
      showToast('工具描述已更新', 'success');
      setSaveAsTool(false);
      setToolSlug('');
    },
    onError: (error: any) => {
      showToast(error.message || '儲存失敗', 'error');
    },
  });

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('內容已複製到剪貼板', 'success');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '處理中';
      case 'pending':
        return '等待中';
      case 'failed':
        return '失敗';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-2">AI 內容生成</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Generate Blog Post */}
        <div className="card">
          <h3 className="heading-3 mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
            生成文章
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主題 *
              </label>
              <input
                type="text"
                value={blogTopic}
                onChange={(e) => setBlogTopic(e.target.value)}
                placeholder="例如：如何使用 Gamma 創建簡報"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                類別（選填）
              </label>
              <input
                type="text"
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
                placeholder="例如：AI 工具"
                className="input-field"
              />
            </div>
            <button
              onClick={() => generateBlogMutation.mutate()}
              disabled={!blogTopic || generateBlogMutation.isPending}
              className="btn-primary w-full inline-flex items-center justify-center"
            >
              {generateBlogMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  生成文章
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generate Tool Description */}
        <div className="card">
          <h3 className="heading-3 mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
            生成工具描述
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工具名稱 *
              </label>
              <input
                type="text"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="例如：Gamma"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工具資訊（選填）
              </label>
              <textarea
                value={toolInfo}
                onChange={(e) => setToolInfo(e.target.value)}
                placeholder="例如：AI 簡報生成工具，支援多種模板..."
                className="input-field"
                rows={3}
              />
            </div>
            <button
              onClick={() => generateToolDescriptionMutation.mutate()}
              disabled={!toolName || generateToolDescriptionMutation.isPending}
              className="btn-primary w-full inline-flex items-center justify-center"
            >
              {generateToolDescriptionMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  生成描述
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generate Image */}
      <div className="card">
        <h3 className="heading-3 mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-primary-600" />
          生成圖片
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              圖片描述 *
            </label>
            <input
              type="text"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="例如：現代簡潔的 AI 工具介面，藍色和黃色主題"
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => generateImageMutation.mutate()}
              disabled={!imagePrompt || generateImageMutation.isPending}
              className="btn-primary w-full inline-flex items-center justify-center"
            >
              {generateImageMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  生成圖片
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generation History */}
      <div className="card">
        <h3 className="heading-3 mb-4">生成歷史</h3>
        {jobsLoading ? (
          <div className="text-center py-12">載入中...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            尚無生成記錄
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                        {job.job_type}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span className="text-sm font-medium">
                          {getStatusLabel(job.status)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(job.created_at), 'yyyy-MM-dd HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>提示詞：</strong>
                      {job.prompt.length > 100
                        ? `${job.prompt.substring(0, 100)}...`
                        : job.prompt}
                    </p>
                    {job.error_message && (
                      <p className="text-sm text-error mb-2">
                        <strong>錯誤：</strong>
                        {job.error_message}
                      </p>
                    )}
                    {job.result_data && job.status === 'completed' && (
                      <div className="mt-2">
                        {job.job_type === 'image' && job.result_data.image_url ? (
                          <div className="flex items-center space-x-2">
                            <img
                              src={job.result_data.image_url}
                              alt="Generated"
                              className="w-32 h-32 object-cover rounded"
                            />
                            <button
                              onClick={() => handleCopyContent(job.result_data?.image_url || '')}
                              className="btn-outline text-sm"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              複製圖片網址
                            </button>
                          </div>
                        ) : job.result_data.content ? (
                          <div className="bg-gray-50 rounded p-3">
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {job.result_data.content.substring(0, 200)}...
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {job.status === 'completed' && job.result_data && (
                      <button
                        onClick={() => handleViewResult(job)}
                        className="btn-outline text-sm"
                      >
                        查看結果
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Result Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="heading-3">生成結果</h3>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setEditingContent('');
                }}
                className="btn-ghost"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    類型：{selectedJob.job_type} | 狀態：{getStatusLabel(selectedJob.status)}
                  </span>
                  <button
                    onClick={() => handleCopyContent(editingContent)}
                    className="btn-outline text-sm inline-flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    複製內容
                  </button>
                </div>
                {selectedJob.job_type === 'image' && selectedJob.result_data?.image_url ? (
                  <div className="space-y-4">
                    <img
                      src={selectedJob.result_data.image_url}
                      alt="Generated"
                      className="w-full max-w-2xl mx-auto rounded-lg"
                    />
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm font-mono break-all">
                        {selectedJob.result_data.image_url}
                      </p>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="input-field"
                    rows={20}
                    placeholder="生成內容將顯示在這裡..."
                  />
                )}
              </div>
              {/* Save Options */}
              {selectedJob.job_type === 'blog_post' && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={saveAsBlog}
                        onChange={(e) => setSaveAsBlog(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">儲存為文章</span>
                    </label>
                  </div>
                  {saveAsBlog && (
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          標題 *
                        </label>
                        <input
                          type="text"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="input-field"
                          placeholder="文章標題"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Slug *
                        </label>
                        <input
                          type="text"
                          value={blogSlug}
                          onChange={(e) => setBlogSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="input-field"
                          placeholder="article-slug"
                        />
                      </div>
                      <button
                        onClick={() => saveBlogMutation.mutate()}
                        disabled={!blogTitle || !blogSlug || saveBlogMutation.isPending}
                        className="btn-primary w-full inline-flex items-center justify-center"
                      >
                        {saveBlogMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            儲存中...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            儲存為文章草稿
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedJob.job_type === 'tool_description' && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={saveAsTool}
                        onChange={(e) => setSaveAsTool(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium">更新工具描述</span>
                    </label>
                  </div>
                  {saveAsTool && (
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          工具 Slug *
                        </label>
                        <input
                          type="text"
                          value={toolSlug}
                          onChange={(e) => setToolSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="input-field"
                          placeholder="tool-slug"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          輸入已存在的工具 Slug
                        </p>
                      </div>
                      <button
                        onClick={() => saveToolMutation.mutate()}
                        disabled={!toolSlug || saveToolMutation.isPending}
                        className="btn-primary w-full inline-flex items-center justify-center"
                      >
                        {saveToolMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            更新中...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            更新工具描述
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setEditingContent('');
                    setSaveAsBlog(false);
                    setSaveAsTool(false);
                    setBlogTitle('');
                    setBlogSlug('');
                    setToolSlug('');
                  }}
                  className="btn-outline"
                >
                  關閉
                </button>
                {selectedJob.job_type !== 'image' && (
                  <button
                    onClick={() => {
                      handleCopyContent(editingContent);
                      showToast('內容已複製，您可以貼上到文章或工具描述中', 'success');
                    }}
                    className="btn-primary inline-flex items-center"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    複製內容
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
