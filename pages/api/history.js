import { clickService } from "../../services/clicks.service";
import { getSession } from "next-auth/client"

export default async function handler(req, res) {

  const session = await getSession({ req });
  const customer_id = session?.sub || 0;

  if (req.method !== 'GET') {
    res.status(404).json({});
  } else {
    const activity = await clickService.getActivity(customer_id);
    res.status(200).json(activity);
  }
}
