import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UsersRepository from "../repositories/UsersRepository";
import * as yup from 'yup'
import AppError from "../errors/AppError";

export default class UserController {

  async index(request: Request, response: Response) {
    const usersRepository = getCustomRepository(UsersRepository)
    const users = await usersRepository.find()
    return response.status(200).json(users)
  }

  async create(request: Request, response: Response) {
    const { name, email } = request.body

    const schema = yup.object().shape(
      {
        name: yup.string().required('Nome é obrigatório'),
        email: yup.string().email('Email inválido').required('Email é obrigatório')
      }
    )

    // if (!await schema.isValid(request.body)) {
    //   return response.status(400).json(
    //     {
    //       error: 'Validation Failed!'
    //     }
    //   )
    // }

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      throw new AppError(err)
    }

    const usersRepository = getCustomRepository(UsersRepository)
    // select * from users where email = email
    const userAlreadyExists = await usersRepository.findOne({ email })
    if (userAlreadyExists) {
      throw new AppError('User already exists!')
    }

    const user = usersRepository.create({ name, email })

    await usersRepository.save(user)

    return response.status(201).json(user)
  }
}