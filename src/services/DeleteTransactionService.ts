// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepositoy = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepositoy.findOne({ where: { id } });

    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }
    console.log(transaction);
    await transactionRepositoy.remove(transaction);
  }
}

export default DeleteTransactionService;
