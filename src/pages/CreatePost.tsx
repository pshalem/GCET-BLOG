import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, X, Tag, Eye, Send,
  Image, FileText, Video, Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store';
import { mockCategories } from '@/utils/mockData';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const mediaTypes = [
  { type: 'image', icon: Image, label: 'Images', accept: 'image/*' },
  { type: 'video', icon: Video, label: 'Videos', accept: 'video/*' },
  { type: 'document', icon: FileText, label: 'Documents', accept: '.pdf,.doc,.docx' },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const { currentUser, addPost } = useAppStore();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
  });
  
  const [tagInput, setTagInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - mediaFiles.length);
      setMediaFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPost = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        author: currentUser!,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: mockCategories.find(c => c.id === formData.category)!,
        tags: formData.tags,
        media: [], // In real app, would upload files and get URLs
        reactions: [],
        comments: [],
        votes: { upvotes: 0, downvotes: 0 },
        isApproved: true,
        status: 'approved' as const
      };

      addPost(newPost);
      
      toast({
        title: "Post created successfully!",
        description: "Your post has been published to the community.",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = mockCategories.find(c => c.id === formData.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create New Post</h1>
            <p className="text-muted-foreground">Share your thoughts with the GCET community</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What's on your mind?"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-lg"
                    maxLength={200}
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {formData.title.length}/200
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, ask questions, or start a discussion..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="min-h-[300px] resize-none"
                    maxLength={5000}
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {formData.content.length}/5000
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer">
                          #{tag}
                          <X 
                            className="w-3 h-3 ml-1 hover:text-destructive" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Add up to 10 tags to help others find your post
                  </p>
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <Label>Media (Optional)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {mediaTypes.map((media) => (
                      <div key={media.type}>
                        <input
                          type="file"
                          accept={media.accept}
                          multiple
                          onChange={(e) => handleMediaUpload(e.target.files)}
                          className="hidden"
                          id={`upload-${media.type}`}
                        />
                        <label
                          htmlFor={`upload-${media.type}`}
                          className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                        >
                          <media.icon className="w-6 h-6 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground">{media.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Uploaded Files */}
                  {mediaFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <p className="text-sm font-medium">Uploaded Files:</p>
                      <div className="space-y-2">
                        {mediaFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMedia(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/')}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      'Publishing...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish Post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{formData.title || 'Your title here...'}</h3>
                  {selectedCategory && (
                    <Badge variant="outline" className="mt-2">
                      {selectedCategory.icon} {selectedCategory.name}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {formData.content || 'Your content will appear here...'}
                </p>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">📝 Be Clear and Specific</p>
                <p className="text-muted-foreground">Use descriptive titles and detailed content</p>
              </div>
              <div>
                <p className="font-medium">🏷️ Use Relevant Tags</p>
                <p className="text-muted-foreground">Help others discover your post with good tags</p>
              </div>
              <div>
                <p className="font-medium">🤝 Be Respectful</p>
                <p className="text-muted-foreground">Follow community guidelines and be kind</p>
              </div>
              <div>
                <p className="font-medium">📚 Provide Context</p>
                <p className="text-muted-foreground">Give enough background for others to understand</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}