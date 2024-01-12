import User from "models/User";

export async function insertAndReplaceDocument(
  client: any,
  collectionName: string,
  replacementDocument: string,
  userEmail: string,
) {
  // Get access to the collection.
  const collection = client.db().collection(collectionName);
  // Finds a document with the matching email if there is one, else it will create one and result will be null.
  const result = await collection.findOneAndReplace(
    { email: userEmail },
    replacementDocument,
    { upsert: true },
  );
}

export async function checkIfUserExists(email: string) {
  const existingUser = await User.findOne({ email: email });

  // Only return boolean value since existing user is falsey or truthy.
  return existingUser !== null;
}
