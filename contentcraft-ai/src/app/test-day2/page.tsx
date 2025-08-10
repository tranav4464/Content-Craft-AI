"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateFormData, blogCreationSchema, type BlogCreation } from "@/lib/validations";
import { createBlog, getUserBlogs, checkDatabaseHealth } from "@/lib/db";
import { formatDate, truncateText, slugify, capitalizeWords } from "@/lib/utils";

export default function TestDay2Page() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogCreation>({
    title: "Test Blog Post",
    topic: "Testing the new validation and database utilities",
    tone: "professional",
    style: "informative",
    length: "medium"
  });

  const runTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-day2');
      const results = await response.json();
      setTestResults(results);
    } catch (error) {
      setTestResults({ error: 'Failed to run tests' });
    } finally {
      setLoading(false);
    }
  };

  const testValidation = () => {
    const validation = validateFormData(blogCreationSchema, formData);
    setTestResults(prev => ({ ...prev, validation }));
  };

  const testUtilities = () => {
    const utilities = {
      formatDate: formatDate(new Date()),
      truncateText: truncateText("This is a very long text that should be truncated to show the utility function working properly", 30),
      slugify: slugify("Test Blog Post Title"),
      capitalizeWords: capitalizeWords("hello world test")
    };
    setTestResults(prev => ({ ...prev, utilities }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🧪 Day 2 Implementation Tests
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test the new database utilities, validation schemas, and utility functions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runTests} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Running Tests..." : "Run All Tests"}
              </Button>
              
              <Button 
                onClick={testValidation} 
                variant="outline"
                className="w-full"
              >
                Test Validation
              </Button>
              
              <Button 
                onClick={testUtilities} 
                variant="outline"
                className="w-full"
              >
                Test Utilities
              </Button>
            </CardContent>
          </Card>

          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Blog Creation Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Textarea
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="authoritative">Authoritative</SelectItem>
                    <SelectItem value="conversational">Conversational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="style">Style</Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, style: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                    <SelectItem value="how-to">How-to</SelectItem>
                    <SelectItem value="listicle">Listicle</SelectItem>
                    <SelectItem value="case-study">Case Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="length">Length</Label>
                <Select
                  value={formData.length}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, length: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
