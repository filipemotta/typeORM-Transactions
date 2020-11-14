import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import categoryRouter from './category.routes';
import uploadConfig from '../config/upload';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepositoy = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepositoy.find({
    relations: ['category'],
  });
  const balance = await transactionRepositoy.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  // const transactionRepositoy = getCustomRepository(TransactionsRepository);

  // const transaction = await transactionRepositoy.findOne({ where: id});
  // if (!transaction) {
  //   throw new AppError('Transaction does not exist');
  // }
  // console.log(transaction);
  // await transactionRepositoy.delete(transaction);

  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions);
  },
);
export default transactionsRouter;
