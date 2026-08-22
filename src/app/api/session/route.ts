import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';

const SESSION_COOKIE_NAME = 'haq_session_id';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
      const session = await prisma.userSession.findUnique({
        where: { id: sessionId },
      });
      if (session) {
        return NextResponse.json(session);
      }
    }

    // Create a new session
    const newSession = await prisma.userSession.create({
      data: {},
    });

    const response = NextResponse.json(newSession);
    response.cookies.set(SESSION_COOKIE_NAME, newSession.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error fetching/creating session:', error);
    return NextResponse.json({ error: 'Failed to manage session' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 });
    }

    const body = await request.json();

    const updatedSession = await prisma.userSession.update({
      where: { id: sessionId },
      data: {
        fullName: body.fullName !== undefined ? body.fullName : undefined,
        fullAddress: body.fullAddress !== undefined ? body.fullAddress : undefined,
        paymentMethod: body.paymentMethod !== undefined ? body.paymentMethod : undefined,
        paymentRef: body.paymentRef !== undefined ? body.paymentRef : undefined,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
