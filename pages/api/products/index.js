import data from './data.js';
import { clickService } from "../../../services/clicks.service";
import { getSession } from "next-auth/client"

export function getProducts() {
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    const session = await getSession({ req });
    const customer_id = session?.sub || 0;
    clickService.addToCart(customer_id, req.body.product, req.body.category, req.body.price);
    res.setHeader('Allow', ['GET']);
    res.status(200).json({});
  } else {
    const products = getProducts();
    res.status(200).json(products);
  }
}
