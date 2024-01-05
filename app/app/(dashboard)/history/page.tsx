"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSmokingSessions } from "@/app/actions/getSmokingSessions";
import type { SmokingSession } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import { Ring } from "react-css-spinners";

const HistoryPage = () => {
  const ITEMS_PER_PAGE = 12;
  const searchParams = useSearchParams();
  const [fetchingData, setFetchingData] = useState<boolean>(false);
  const [page, setPage] = React.useState(1);
  const [maxPages, setMaxPages] = React.useState(1);

  const handlePageChange = async (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
    const res = await getSmokingSessions(newPage, ITEMS_PER_PAGE);
    if (!res.data) {
      console.log("no previous sessions available");
      return;
    } else {
      const sessions = await JSON.parse(res.data);
      // console.log(sessions.smokingSessions);
      setMaxPages(Math.ceil(sessions.count / ITEMS_PER_PAGE));
      setPreviousSessions(sessions.smokingSessions);
    }
  };

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
      setFetchingData(true);
      const res = await getSmokingSessions(page, ITEMS_PER_PAGE);
      if (!res.data) {
        console.log("no previous sessions available");
        return;
      } else {
        const sessions = await JSON.parse(res.data);
        // console.log(sessions.smokingSessions);
        setMaxPages(Math.ceil(sessions.count / ITEMS_PER_PAGE));
        setPreviousSessions(sessions.smokingSessions);
      }
      setFetchingData(false);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <div className="w-[1400px] pt-6 h-full flex justify-start items-start">
      {fetchingData ? (
        <div className="w-full h-full flex justify-center items-center">
          <Ring color="orange" size={100} />
        </div>
      ) : (
        <div className="w-full h-full flex justify-start items-center flex-col">
          <h1 className="mb-6 text-4xl text-[#F4EDE5] font-semibold">
            History of smoking sessions
          </h1>
          <div className="w-full h-fit justify-start p-4 bg-[#F4EDE5] rounded-[20px]">
            <Table>
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
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Pagination
                      count={maxPages}
                      page={page}
                      color="primary"
                      onChange={handlePageChange}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
