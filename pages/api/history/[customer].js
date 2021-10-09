import { clickService } from "../../../services/clicks.service";

export default async function handler(req, res) {

  const customer_id = req.query.customer;

  if (req.method !== 'GET') {
    res.status(404).json({});
  } else {
    const activity = await clickService.getActivity(customer_id);
    res.status(200).json(activity);
  }
}
