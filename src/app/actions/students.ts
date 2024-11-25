// src/app/actions/students.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getAllStudents() {
  return await prisma.student.findMany({
    include: {
      occurrences: true,
    },
  });
}

export async function createStudent({
  nome,
  email,
  turma,
  data_nascimento,
}: {
  nome: string;
  email: string;
  turma: string;
  data_nascimento: string;
}) {
  return await prisma.student.create({
    data: {
      nome,
      email,
      turma,
      data_nascimento: new Date(data_nascimento).toISOString(), // Garantindo formato compatível
    },
  });
}

export async function deleteStudent(id: string) {
  return await prisma.student.delete({
    where: { id },
  });
}

export async function getOccurrencesByStudentId(studentId: string) {
  return await prisma.occurrence.findMany({
    where: { alunoId: studentId },
  });
}

export async function searchStudentsByName(name: string) {
  console.log(`Searching for students with name containing: ${name}`); // Log de depuração
  const students = await prisma.student.findMany({
    where: {
      nome: {
        contains: name,
      },
    },
    include: {
      occurrences: true,
    },
  });
  console.log(`Found students: ${JSON.stringify(students)}`); // Log de depuração
  return students;
}