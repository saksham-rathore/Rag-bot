import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/db.connect";
import Document from "@/app/Model/Document";
import Chunk from "@/app/Model/Chunk";
import NextAuth from "next-auth/next";
import fs from "fs/promises"
import pdf from "pdf-parse"
import { Buffer } from "buffer";


export async function POST(req: NextRequest) {
    
}