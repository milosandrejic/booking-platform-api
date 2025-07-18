import bcypt from "bcrypt";

export class PasswordUtils {
  public static hash = async (plainPassword: string): Promise<string> => {
    if (!plainPassword) {
      throw new Error("Password is required");
    }

    const hashedPassword = await bcypt.hash(plainPassword, 10);

    return hashedPassword;
  };

  public static compare = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    if (!plainPassword || !hashedPassword) {
      return false;
    }

    const match = await bcypt.compare(plainPassword, hashedPassword);

    return match;
  };
}
