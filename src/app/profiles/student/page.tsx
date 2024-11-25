"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { getOccurrencesByStudentId, searchStudentsByName } from "@/app/actions/students";

// Tipagem
interface Occurrence {
  id: string;
  data: string;
  tipo: string;
  descricao: string;
}

interface Student {
  id: string;
  nome: string;
  email: string;
  turma: string;
  data_nascimento: string;
}

// Componente para exibir a tabela de ocorrências
function OccurrenceTable({
  occurrences,
  onViewOccurrence,
}: {
  occurrences: Occurrence[];
  onViewOccurrence: (occurrence: Occurrence) => void;
}) {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="text-left py-3 px-4 text-gray-600">Data</th>
          <th className="text-left py-3 px-4 text-gray-600">Tipo</th>
          <th className="text-left py-3 px-4 text-gray-600">Descrição</th>
          <th className="text-left py-3 px-4 text-gray-600">Ações</th>
        </tr>
      </thead>
      <tbody>
        {occurrences.map((occurrence) => (
          <tr key={occurrence.id} className="border-t border-gray-200">
            <td className="py-3 px-4">{occurrence.data}</td>
            <td className="py-3 px-4">{occurrence.tipo}</td>
            <td className="py-3 px-4">{occurrence.descricao}</td>
            <td className="py-3 px-4">
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => onViewOccurrence(occurrence)}
              >
                Visualizar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Componente principal
export default function PerfilAluno() {
  const [selectedOccurrence, setSelectedOccurrence] = useState<Occurrence | null>(null);
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const handleViewOccurrence = (occurrence: Occurrence) => {
    setSelectedOccurrence(occurrence);
  };

  const handleCloseView = () => {
    setSelectedOccurrence(null);
  };

  const fetchOccurrences = async (studentId: string) => {
    setLoading(true);
    try {
      const data = await getOccurrencesByStudentId(studentId);
      setOccurrences(data);
    } catch (error) {
      toast.error("Erro ao buscar ocorrências.");
    } finally {
      setLoading(false);
    }
  };

  const searchStudents = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const students = await searchStudentsByName(search);
      console.log("Search results:", students); // Log de depuração
      setSearchResults(students);
    } catch (error) {
      toast.error("Erro ao buscar alunos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentData) {
      fetchOccurrences(studentData.id);
    }
  }, [studentData]);

  const handleSelectStudent = (student: Student) => {
    setStudentData(student);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-2xl font-semibold text-gray-800">
            Sistema de Ocorrências
          </span>
          <div className="flex space-x-4">
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/">Logout</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-8">
        {!studentData ? (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Buscar Aluno</h2>
            <Input
              placeholder="Digite o nome do aluno"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="my-4"
            />
            <Button onClick={searchStudents} disabled={loading}>
              {loading ? "Pesquisando..." : "Pesquisar"}
            </Button>
            <div className="mt-4">
              {searchResults.map((student) => (
                <div key={student.id} className="bg-white p-4 rounded mb-2">
                  <p>{student.nome}</p>
                  <Button onClick={() => handleSelectStudent(student)}>
                    Selecionar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Perfil do Aluno</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Dados Pessoais
                </h3>
                <p className="mb-2">
                  <strong>Nome:</strong> {studentData.nome}
                </p>
                <p className="mb-2">
                  <strong>Data de Nascimento:</strong> {studentData.data_nascimento}
                </p>
                <p className="mb-2">
                  <strong>Turma:</strong> {studentData.turma}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {studentData.email}
                </p>
              </div>

              <div className="col-span-2">
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Histórico de Ocorrências
                  </h3>
                  {loading ? (
                    <p>Carregando ocorrências...</p>
                  ) : (
                    <OccurrenceTable
                      occurrences={occurrences}
                      onViewOccurrence={handleViewOccurrence}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}