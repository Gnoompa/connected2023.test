import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default (req: NextRequest) => {
    const {id} = req.query

  return NextResponse.json({
    name: id,
  });
};
