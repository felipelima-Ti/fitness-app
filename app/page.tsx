"use client";

import { Dumbbell, Flame, Calendar, ChartBar, Trophy, User } from "lucide-react";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white">
      
      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Transforme seu treino em resultado
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Acompanhe seus exercícios, calorias e evolução de forma simples e inteligente.
          O seu personal trainer digital na palma da mão.
        </p>

        <Link href="/login">
          <button className="bg-green-500 hover:bg-green-600 transition px-8 py-3 rounded-xl text-lg font-semibold">
            Experimente Agora
          </button>
        </Link>
      </section>

      {/* SERVIÇOS */}
      <section className="px-6 pb-20">
        <h2 className="text-2xl font-semibold text-center mb-10">
          O que você encontra no app
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* Card 1 */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <Dumbbell size={32} className="text-green-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Registro de Treinos</h3>
            <p className="text-gray-300">
              Salve seus exercícios, duração e acompanhe tudo em tempo real.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <Flame size={32} className="text-red-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Cálculo de Calorias</h3>
            <p className="text-gray-300">
              Descubra exatamente quantas calorias você queima em cada treino.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <Calendar size={32} className="text-blue-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Histórico Semanal</h3>
            <p className="text-gray-300">
              Veja seu desempenho organizado por dia e acompanhe sua evolução.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <ChartBar size={32} className="text-yellow-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Relatórios Inteligentes</h3>
            <p className="text-gray-300">
              Analise estatísticas e melhore seus resultados com base em dados.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <Trophy size={32} className="text-purple-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Metas e Conquistas</h3>
            <p className="text-gray-300">
              Defina objetivos e acompanhe cada conquista alcançada.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <User size={32} className="text-teal-400 mb-3" />
            <h3 className="text-xl font-bold mb-2">Perfil Personalizado</h3>
            <p className="text-gray-300">
              Área exclusiva para você acompanhar todo seu progresso.
            </p>
          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className=" items-center justify-center text-center pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-90 md:w-200 bg-gray-900 rounded-2xl border border-blue-400 p-20">
        <h3 className="text-4xl font-bold mb-4">
          Pronto para <b className="text-blue-400">Comecar?</b>
        </h3>
        <p className="text-gray-300 mb-8 font-bold">Junte-se a milhares de pessoas que já transformaram suas vidas. Comece sua<br></br>jornada fitness hoje mesmo com 7 dias grátis.</p>
       

        <Link href="/login">
          <button className="bg-green-500 hover:bg-green-600 transition px-10 py-4 rounded-xl text-lg font-semibold">
            Experimente Agora
          </button>
        </Link>
        </div>
      </section>

    </div>
  );
}
