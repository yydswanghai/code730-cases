import "reflect-metadata"
import { IsNotEmpty, Max, MaxLength, Min, MinLength, validate } from "class-validator"

class RegUser {
    @IsNotEmpty({ message: "账号不能为空" })
    @MinLength(5, { message: "账号必须至少有5个字符" })
    @MaxLength(12, { message: "账号字符不能超过12个" })
    loginId: string

    loginPwd: string

    @Min(0, { message: "年龄最小值是0" })
    @Max(100, { message: "年龄大最大值是100" })
    age: number
    gender: "男" | "女"
}

const post = new RegUser();
post.loginId = 'abcd'
post.age = -1

validate(post).then(errors => {
    console.log(errors)
})