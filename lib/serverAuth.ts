import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import prismadb from '@/lib/prismadb';
// import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const serverAuth = async (req: NextApiRequest) => {
    const session = await getSession({ req });
    // const session = await getServerSession( req, res, authOptions);

    if (!session?.user?.email) {
        throw new Error("Not Signed in");
    }

    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        }
    })

    if (!currentUser) {
        throw new Error("Not Signed in");
    }

    return { currentUser }

}

export default serverAuth;