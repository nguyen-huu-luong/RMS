import {NextResponse} from "next/server";
import mjml2html from "mjml";
import { NextApiRequest } from "next";

export async function POST(request: Request) {
  const data = await request.json()
  console.log(data)
  console.log(request.body)
  return NextResponse.json(mjml2html(data));
}