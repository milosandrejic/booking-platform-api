import bcypt from "bcrypt";

export class PasswordUtils {
  public static hash = async (plainPassword: string): Promise<string> => {
    const hashedPassword = await bcypt.hash(plainPassword, 10);

    return hashedPassword;
  };

  public static compare = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    const match = await bcypt.compare(plainPassword, hashedPassword);

    return match;
  };
}
