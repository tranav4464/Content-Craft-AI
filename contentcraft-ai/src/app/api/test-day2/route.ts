import { NextResponse } from 'next/server';
import { checkDatabaseHealth, createBlog, getUserBlogs } from '@/lib/db';
import { validateFormData, blogCreationSchema } from '@/lib/validations';
import { formatDate, truncateText, slugify, capitalizeWords } from '@/lib/utils';

export async function GET() {
  try {
    // Test database health
    const dbHealth = await checkDatabaseHealth();
    
    // Test utility functions
    const utilities = {
      formatDate: formatDate(new Date()),
      truncateText: truncateText("This is a very long text that should be truncated to show the utility function working properly", 30),
      slugify: slugify("Test Blog Post Title"),
      capitalizeWords: capitalizeWords("hello world test")
    };
    
    // Test validation with sample data
    const sampleData = {
      title: "Test Blog Post",
      topic: "Testing the new validation and database utilities",
      tone: "professional" as const,
      style: "informative" as const,
      length: "medium" as const
    };
    
    const validation = validateFormData(blogCreationSchema, sampleData);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: dbHealth,
      utilities,
      validation,
      message: "Day 2 implementation tests completed successfully"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Test validation with provided data
    const validation = validateFormData(blogCreationSchema, body);
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        validation: validation.errors,
        message: "Validation failed"
      }, { status: 400 });
    }
    
    // Test utilities with provided data
    const utilities = {
      formatDate: formatDate(new Date()),
      truncateText: truncateText(body.title || "Default Title", 20),
      slugify: slugify(body.title || "Default Title"),
      capitalizeWords: capitalizeWords(body.topic || "default topic")
    };
    
    return NextResponse.json({
      success: true,
      validation: validation.data,
      utilities,
      message: "POST test completed successfully"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
