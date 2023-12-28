"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllSmokingSessions } from "@/app/actions/getAllSmokingSessions";
import type { SmokingSession } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import moment from "moment";

const HistoryPage = () => {
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const [previousSessions, setPreviousSessions] = useState<SmokingSession[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllSmokingSessions();
      if (!res.data) {
        console.log("no previous sessions available");
        return;
      } else {
        const previous = await JSON.parse(res.data);
        console.log(previous.smokingSessions);
        setPreviousSessions(previous.smokingSessions);
      }
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <div className="w-[1000px] pt-[100px]">
      {previousSessions.length > 0 && (
        <Table>
          <TableCaption>A list of all your smoking sessions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Session title</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Date started</TableHead>
              <TableHead className="text-right">Wood types</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previousSessions.map((smokingSession) => (
              <TableRow key={smokingSession.id}>
                <TableCell className="p-0">
                  <Link
                    className="block p-4"
                    href={
                      `/session/${smokingSession.id}` +
                      "?" +
                      createQueryString("fromHistory", "true")
                    }
                  >
                    {smokingSession.id}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    className="block p-4"
                    href={
                      `/session/${smokingSession.id}` +
                      "?" +
                      createQueryString("fromHistory", "true")
                    }
                  >
                    {smokingSession.title}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    className="block p-4"
                    href={
                      `/session/${smokingSession.id}` +
                      "?" +
                      createQueryString("fromHistory", "true")
                    }
                  >
                    {smokingSession.products.join(", ")}
                  </Link>
                </TableCell>
                <TableCell className="p-0">
                  <Link
                    className="block p-4"
                    href={
                      `/session/${smokingSession.id}` +
                      "?" +
                      createQueryString("fromHistory", "true")
                    }
                  >
                    {moment(smokingSession.dateStart).format(
                      "ddd DD.MM.YYYY HH:mm"
                    )}
                  </Link>
                </TableCell>
                <TableCell className="p-0 text-right">
                  <Link
                    className="block p-4"
                    href={
                      `/session/${smokingSession.id}` +
                      "?" +
                      createQueryString("fromHistory", "true")
                    }
                  >
                    {smokingSession.woods.join(", ")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      )}
      {previousSessions.length <= 0 && <p>Loading previous sessions...</p>}
    </div>
  );
};

export default HistoryPage;
