import { sanityWriteClient } from "@/lib/sanity.write";

// ...
const created = await sanityWriteClient.create({
  _type: "bookingRequest",
  status: "new",
  createdAt: new Date().toISOString(),
  date,
  time,
  timezone,
  name,
  email,
  phone: phone || undefined,
  preferredContact,
  shootType: shootType || undefined,
  location: location || undefined,
  message: message || undefined,
  consent,
});