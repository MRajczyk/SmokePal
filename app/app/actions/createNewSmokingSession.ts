"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import {
  NewSmokingSchema,
  type NewSmokingSchemaType,
} from "@/schemas/NewSmokingSchema";

export async function createNewSmokingSession(
  data: NewSmokingSchemaType,
  imagesFormData: FormData
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  const parseResult = NewSmokingSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, message: "Invalid new session data" };
  }
  const userFromSession = session.user;

  try {
    //first end all possible not-finished sessions
    await prisma.smokingSession.updateMany({
      where: {
        finished: false,
      },
      data: {
        finished: true,
      },
    });

    const newSession = await prisma.smokingSession.create({
      data: {
        authorId: userFromSession.id,
        finished: false,
        title: parseResult.data.title,
        products: parseResult.data.products.map((item) => {
          return item.value;
        }),
        woods: parseResult.data.woods.map((item) => {
          return item.value;
        }),
        description: parseResult.data.description,
        tempSensor1Name: parseResult.data.tempSensor1Name,
        tempSensor2Name: parseResult.data.tempSensor2Name,
        tempSensor3Name: parseResult.data.tempSensor3Name,
      },
    });
    if (!newSession.id) {
      return { success: false, message: "Could not create new session" };
    }

    const files = imagesFormData.getAll("files[]");

    // files.forEach((file) => {
    //   let fileBytes;
    //   const parsedFile: File = file;
    //   parsedFile.arrayBuffer().then((byteArray) => {
    //     fileBytes = new Uint8Array(byteArray);
    //     console.log(fileBytes);

    //     prisma.smokingSessionPhoto.create({
    //       data: {
    //         sessionId: newSession.id,
    //         data: fileBytes,
    //       },
    //     });
    //   });

    files.forEach(async (file) => {
      const parsedFile: File = file;

      const res = await prisma.smokingSessionPhoto.create({
        data: {
          sessionId: newSession.id,
          data: Buffer.from(await parsedFile.arrayBuffer()),
          mime: parsedFile.type,
        },
      });
      console.log(res);
    });

    return {
      success: true,
      data: JSON.stringify({ sessionId: newSession.id }),
    };
  } catch (e) {
    return { success: false, message: "Could not create new session" };
  }
}
