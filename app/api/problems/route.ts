import { NextResponse } from 'next/server';

// Define sample problems for demonstration
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

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const ownerId = url.searchParams.get('ownerId');
    const status = url.searchParams.get('status');
    
    // Filter problems based on query parameters
    let filteredProblems = [...sampleProblems];
    
    if (tenantId) {
      filteredProblems = filteredProblems.filter(problem => problem.tenantId === tenantId);
    }
    
    if (ownerId) {
      filteredProblems = filteredProblems.filter(problem => problem.ownerId === ownerId);
    }
    
    if (status) {
      filteredProblems = filteredProblems.filter(problem => problem.status === status);
    }
    
    // In a real application, you would fetch problems from your database
    // const problems = await prisma.problem.findMany({
    //   where: {
    //     ...(tenantId && { tenantId }),
    //     ...(ownerId && { ownerId }),
    //     ...(status && { status })
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });
    
    return NextResponse.json(filteredProblems);
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    if (!body.title || !body.description || !body.propertyId || !body.tenantId || !body.ownerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would create a new problem in your database
    // const newProblem = await prisma.problem.create({
    //   data: {
    //     title: body.title,
    //     description: body.description,
    //     propertyId: body.propertyId,
    //     tenantId: body.tenantId,
    //     ownerId: body.ownerId,
    //     status: 'pending',
    //     priority: body.priority || 'medium',
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //     completedAt: null
    //   }
    // });

    // Temporary response for demonstration
    const newProblem = {
      id: Date.now(),
      title: body.title,
      description: body.description,
      propertyId: body.propertyId,
      tenantId: body.tenantId,
      ownerId: body.ownerId,
      status: 'pending',
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };

    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    console.error('Failed to create problem:', error);
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}
