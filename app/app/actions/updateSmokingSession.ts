"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import {
  UpdateSmokingSchema,
  type UpdateSmokingSchemaType,
} from "@/schemas/UpdateSmokingSchema";

export async function createNewSmokingSession(
  data: UpdateSmokingSchemaType,
  imagesFormData: FormData,
  imagesIdToDelete: string[]
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    // TODO: maybe redirect to login page?
    return { success: false, message: "Unauthorized" };
  }

  const parseResult = UpdateSmokingSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, message: "Invalid new session data" };
  }
  const userFromSession = session.user;

  try {
    //first end all possible not-finished sessions
    const sessionInstance = await prisma.smokingSession.findFirst({
      where: {
        id: parseResult.data.id,
      },
    });

    if (!sessionInstance) {
      return { success: false, message: "Invalid session Id" };
    }

    if (sessionInstance.authorId !== userFromSession.id) {
      return { success: false, message: "Unauthorized" };
    }

    //TODO: in the future handle all of these in a single transaction maybe
    const updatedSession = await prisma.smokingSession.update({
      where: {
        id: parseResult.data.id,
      },
      data: {
        finished: parseResult.data.finished,
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

    const files = imagesFormData.getAll("files[]");

    files.forEach(async (file) => {
      if (file instanceof File) {
        const parsedFile: File = file;

        await prisma.smokingSessionPhoto.create({
          data: {
            sessionId: updatedSession.id,
            data: Buffer.from(await parsedFile.arrayBuffer()),
            mime: parsedFile.type,
          },
        });
      }
    });

    await prisma.smokingSessionPhoto.deleteMany({
      where: {
        id: {
          //TODO: handle non numeric ids
          in: imagesIdToDelete.map((id) => Number.parseInt(id)),
        },
      },
    });

    return {
      success: true,
    };
  } catch (e) {
    return { success: false, message: "Could not update the session" };
  }
}
