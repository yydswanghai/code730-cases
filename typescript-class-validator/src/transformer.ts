import "reflect-metadata"
import { Type, plainToClass } from "class-transformer"
import axios from "axios"

class User {
    id: number
    firstName: string
    lastName: string

    @Type(() => Number)// 告诉ts运行时，age的类型为number
    age: number

    getName(){
        return this.firstName + " " + this.lastName
    }
    isAdult(){
        return this.age > 36 && this.age < 60
    }
}

axios.get("http://127.0.0.1:4523/m1/1228643-0-default/getUserData")
.then(res => res.data)
.then(res => {
    const us = plainToClass(User, res.data);
    for (const key in us) {
        const u = us[key] as User;
        console.log(u)
    }
})