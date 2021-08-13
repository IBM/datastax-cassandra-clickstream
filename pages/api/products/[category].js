import data from './data.js';
import { clickService } from "../../../services/clicks.service";

export function getProductsByCategory(category) {

  const products = data.filter((product) => product.category === category);
  return products;
}

export default async function handler(req, res) {
  const category = req.query.category;
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  } else {
    const products = getProductsByCategory(category);
    res.status(200).json(products);
  }
}