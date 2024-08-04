"use server"

import  connectToDB  from "../mongoose"
import User from "../models/users.models"

export async function createUser(user:any){
    try{
        await connectToDB();
        const newUser = await  User.create(user);
        return JSON.parse(JSON.stringify(newUser));

    } catch (e) {
        console.log("userActionError",e);
    }
}