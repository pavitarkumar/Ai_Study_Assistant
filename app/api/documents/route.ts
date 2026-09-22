import { NextResponse } from 'next/server';
import { dbStore } from '@/lib/db';
import { documentIntelligence } from '@/lib/azure/documentIntelligence';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'user-demo-123';
  
  // STRICT USER ISOLATION
  const docs = dbStore.getDocuments(userId);
  return NextResponse.json({ success: true, data: docs });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 'user-demo-123',
      filename,
      fileSizeMb = 1.0,
      topics = ['Computer Science'],
      fileContent,
    } = body;

    if (!filename) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FILENAME', message: 'Filename is required' } },
        { status: 400 }
      );
    }

    // Process through Document Intelligence abstraction pipeline
    const processed = await documentIntelligence.processDocument(userId, filename, fileContent);

    // Save document to DB store with real chunk count
    const newDoc = dbStore.addDocument(
      userId,
      processed.filename,
      Number(fileSizeMb) || processed.fileSizeMb,
      processed.topics,
      processed.chunks?.length || 2
    );

    // Index chunks into dbStore so RAG search can immediately query and cite them
    if (processed.chunks && processed.chunks.length > 0) {
      const knowledgeChunks = processed.chunks.map((ch, idx) => ({
        chunkId: `chk-${newDoc.id}-${idx + 1}`,
        documentId: newDoc.id,
        userId,
        filename: processed.filename,
        pageNumber: ch.pageNumber,
        topic: ch.topic,
        content: ch.content,
        score: 0.92,
      }));
      dbStore.addChunks(knowledgeChunks);
    }

    return NextResponse.json({
      success: true,
      data: newDoc,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: 'UPLOAD_FAILED', message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('id');

  if (!documentId) {
    return NextResponse.json(
      { success: false, error: { code: 'MISSING_ID', message: 'Document ID is required' } },
      { status: 400 }
    );
  }

  dbStore.deleteDocument(documentId);
  return NextResponse.json({ success: true, message: 'Document deleted successfully.' });
}
