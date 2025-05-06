import { NextResponse } from 'next/server';

// Define sample problems for demonstration (same as in the main route)
const sampleProblems = [
  {
    id: 1,
    title: 'Leaking Faucet',
    description: 'The kitchen faucet is leaking and causing water damage.',
    propertyId: 'PROP123',
    tenantId: 'TENANT1',
    ownerId: 'OWNER1',
    status: 'pending', // pending, in-progress, completed
    priority: 'medium', // low, medium, high
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    completedAt: null
  },
  {
    id: 2,
    title: 'Broken Window',
    description: 'The window in the living room is broken and needs to be fixed.',
    propertyId: 'PROP123',
    tenantId: 'TENANT1',
    ownerId: 'OWNER1',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    completedAt: null
  },
  {
    id: 3,
    title: 'Electrical Issue',
    description: 'The power outlets in the bedroom are not working.',
    propertyId: 'PROP456',
    tenantId: 'TENANT1',
    ownerId: 'OWNER2',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    completedAt: new Date(Date.now() - 1 * 86400000).toISOString() // 1 day ago
  }
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // In a real application, you would fetch a specific problem from your database
    // const problem = await prisma.problem.findUnique({ where: { id } });
    
    // For demonstration, find the problem in our sample data
    const problem = sampleProblems.find(p => p.id === id);
    
    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error('Failed to fetch problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    // In a real application, you would update the problem in your database
    // const updatedProblem = await prisma.problem.update({
    //   where: { id },
    //   data: {
    //     ...(body.title && { title: body.title }),
    //     ...(body.description && { description: body.description }),
    //     ...(body.status && { status: body.status }),
    //     ...(body.priority && { priority: body.priority }),
    //     updatedAt: new Date().toISOString(),
    //     ...(body.status === 'completed' && { completedAt: new Date().toISOString() })
    //   }
    // });

    // For demonstration, create an updated problem object
    const updatedProblem = {
      id,
      title: body.title || 'Updated Problem',
      description: body.description || 'Updated description',
      propertyId: body.propertyId || 'PROP123',
      tenantId: body.tenantId || 'TENANT1',
      ownerId: body.ownerId || 'OWNER1',
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: body.status === 'completed' ? new Date().toISOString() : null
    };

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error('Failed to update problem:', error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // In a real application, you would delete the problem from your database
    // await prisma.problem.delete({ where: { id } });

    return NextResponse.json(
      { message: 'Problem deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete problem:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
}
