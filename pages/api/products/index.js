import data from './data.js';
import { clickService } from "../../../services/clicks.service";

export function getProducts() {
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    clickService.addToCart(req.body.product, req.body.category, req.body.price);
    res.setHeader('Allow', ['GET']);
    res.status(200).json({});
  } else {
    const products = getProducts();
    res.status(200).json(products);
  }
}
