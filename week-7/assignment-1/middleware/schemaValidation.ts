import {z} from 'zod';
import {Request, Response, NextFunction} from 'express'

const todoPostRequestSchema = z.object({
    title:z.string(),
    description:z.string()
  })

export function todoPostRequestSchemaValidation(req:Request,res:Response,next:NextFunction){
    try{
        todoPostRequestSchema.parse(req.body);
        next();
    }catch (error){
        if(error instanceof Error){
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({error:"Incorrect use of datatypes in the request body"})
    }
}


const userCredentialsSchema = z.object({
    username:z.string(),
    password:z.string()
});

export function userCredentialsSchemaValidation(req:Request,res:Response,next:NextFunction){
    try{
        userCredentialsSchema.parse(req.body);
        next();
    }catch (error){
        if(error instanceof Error){
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({error:"Incorrect use of datatypes in the request body"})
    }
}