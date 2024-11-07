'use client'

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/spinner";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  emailAddresses: { emailAddress: string }[];
  completedHabitsCount: number;
}

export default function Leaderboard() {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedBy, setSortedBy] = useState<'rank' | 'name' | 'completedHabits'>('rank'); 
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
  const [isSorted, setIsSorted] = useState(false);
  
  const getCompletedHabits = useMutation(api.habits.getCompletedHabits);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        const usersWithHabits = await Promise.all(data.map(async (user: User) => ({
          ...user,
          completedHabitsCount: await getCompletedHabits({ userId: user.id }) || 0,
        })));
        setUserList(usersWithHabits);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [getCompletedHabits]);

  const handleSort = (column: 'rank' | 'name' | 'completedHabits') => {
    if (sortedBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedBy(column);
      setSortOrder('asc');
    }
    setIsSorted(true);
  };
  
  const sortedUsers = [...userList].sort((a, b) => {
    if (sortedBy === 'rank') {
      return (b.completedHabitsCount - a.completedHabitsCount) * (sortOrder === 'asc' ? 1 : -1);
    }
    if (sortedBy === 'name') {
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`) * (sortOrder === 'asc' ? 1 : -1);
    }
    return (b.completedHabitsCount - a.completedHabitsCount) * (sortOrder === 'asc' ? 1 : -1);
  });
  
  const usersWithRank = sortedUsers.map((user, index): User & { rank: number } => ({
    ...user,
    rank: sortOrder === 'asc' ? index + 1 : sortedUsers.length - index,
  }));

  const filteredUsers = usersWithRank.filter((user) => {
    const userFullName = `${user.firstName} ${user.lastName}`;
    const userEmail = user.emailAddresses[0]?.emailAddress || '';
    return `${userFullName} ${userEmail}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const maxItemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / maxItemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * maxItemsPerPage, currentPage * maxItemsPerPage);

  if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Leaderboard</h1>

      <input
        type="text"
        placeholder="Search by user name"
        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table className="min-w-full text-left bg-gray-300 dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700">
        <TableCaption>A list of the leaderboard users.</TableCaption>
        <TableHeader>
          <TableRow className="text-white">
            <TableHead 
              className={`py-3 px-4 text-center cursor-pointer ${isSorted && sortedBy === 'rank' ? 'bg-gray-400 text-black' : ''}`} 
              style={{ width: '120px' }} 
              onClick={() => handleSort('rank')}
            >
              Rank 
              {isSorted && sortedBy === 'rank' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead 
              className={`py-3 px-4 cursor-pointer ${isSorted && sortedBy === 'name' ? 'bg-gray-400 text-black' : ''}`} 
              style={{ width: '250px' }} 
              onClick={() => handleSort('name')}
            >
              User 
              {isSorted && sortedBy === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead 
              className={`py-3 px-4 text-center cursor-pointer ${isSorted && sortedBy === 'completedHabits' ? 'bg-gray-400 text-black' : ''}`} 
              style={{ width: '180px' }} 
              onClick={() => handleSort('completedHabits')}
            >
              Completed Habits 
              {isSorted && sortedBy === 'completedHabits' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user, index) => (
            <TableRow key={user.id} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}>
              <TableCell className="py-3 px-4 text-center">{user.rank}</TableCell>  {/* Dynamically rendered rank */}
              <TableCell className="py-3 px-4">
                <div className="flex items-center">
                  {user.imageUrl && <img src={user.imageUrl} alt={user.firstName} className="w-8 h-8 rounded-full mr-3" />}
                  <span>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName
                      ? user.firstName
                      : user.lastName
                      ? user.lastName
                      : user.emailAddresses.length > 0
                      ? user.emailAddresses[0].emailAddress
                      : 'No email available'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3 px-4 text-center">{user.completedHabitsCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          className="px-3 py-1 bg-gray-500 text-white rounded-md"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-lg">Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          className="px-3 py-1 bg-gray-500 text-white rounded-md"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
