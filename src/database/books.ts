﻿import { knexClient, PAGE_SIZE } from "./knexClient";
import {BookRequest} from "../models/requestModels";

export const fetchAllBooks = (search: string, page: number) => {
    return knexClient
        .select("*")
        .from("book")
        .where("deleted", false)
        .andWhere(builder => {
            builder
                .where("title", "ILIKE", `%${search}%`)
                .orWhere("author", "ILIKE", `%${search}%`);
        })
        .offset(PAGE_SIZE * (page - 1))
        .limit(PAGE_SIZE);
}

export const fetchBookById = (bookId: number) => {
    return knexClient
        .select("*")
        .from("book")
        .where("id", bookId)
        .first();
}

export const insertBook = async (book: BookRequest) => {
    const insertedIds = await knexClient
        .insert({
            title: book.title,
            cover_image_url: book.coverImageUrl,
            published_date: book.publishDate,
            publisher: book.publisher,
            isbn: book.isbn,
            author: book.author
        })
        .into("book")
        .returning("*");
    
    return insertedIds[0];
}

export const updateBook = async (id: number, book: BookRequest) => {
    const updatedRows = await knexClient("book")
        .update({
            title: book.title,
            author: book.author,
            cover_image_url: book.coverImageUrl,
            published_date: book.publishDate,
            publisher: book.publisher,
            isbn: book.isbn
        })
        .where("id", id)
        .returning("*");
    
    return updatedRows[0];
}

export const deleteBook = async (id: number) => {
    await knexClient("book")
        .update("deleted", true)
        .where("id", id);
}

export const reinstateBook = async (id: number) => {
    await knexClient("book")
        .update("deleted", false)
        .where("id", id);
}