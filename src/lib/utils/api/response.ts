import { NextResponse } from 'next/server';

type ApiResponse<T> =
  | {
      success: true;
      error: null;
      status: number;
      data: T;
    }
  | {
      success: false;
      error: string;
      status: number;
      data: null;
    };

const err = (
  message: string = 'Internal Server error',
  status: number = 500
): ApiResponse<never> => ({
  success: false,
  error: message,
  status,
  data: null
});

const ok = <T>(data: T, status = 200): ApiResponse<T> => ({
  success: true,
  error: null,
  status,
  data
});

const jsonResponse = <T>(res: ApiResponse<T>) => {
  return NextResponse.json(res, { status: res.status });
};

export { err, ok, jsonResponse, type ApiResponse };
