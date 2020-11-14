import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request {
  title: string;
}

class CategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const checkCategoryExist = await categoryRepository.findOne({
      where: { title },
    });

    if (checkCategoryExist) {
      throw new AppError('Category already exist !');
    }

    const category = categoryRepository.create({
      title,
    });

    await categoryRepository.save(category);

    return category;
  }
}

export default CategoryService;
