"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const DiffEditor = dynamic(() => import("@monaco-editor/react").then(mod => mod.DiffEditor), { ssr: false });

type Document = { _id: string; [key: string]: any };
type Collection = { name: string; documents: Document[] };

export function DatabaseEditor() {
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [editorValue, setEditorValue] = useState<string>("");
  const [originalValue, setOriginalValue] = useState<string>("");
  const [showDiff, setShowDiff] = useState(false);

  // Buscar as collections disponíveis
  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch("/api/proxy?path=/api/db/collections");
        const data = await res.json();
        const filteredData = data.filter(collection => collection !== "sensorsData");
        setCollections(filteredData);
      } catch (error) {
        console.error("Erro ao buscar collections", error);
        toast.error("Erro ao buscar collections.");
      }
    }
    fetchCollections();
  }, []);

  // Buscar documentos da collection selecionada
  useEffect(() => {
    if (!selectedCollection) return;
    async function fetchDocuments() {
      try {
        const res = await fetch(`/api/proxy?path=/api/db/collections/${selectedCollection}`);
        const data = await res.json();
        setDocuments(data);
        console.log(documents)
        setSelectedDocId(null);
      } catch (error) {
        console.error("Erro ao buscar documentos", error);
        toast.error("Erro ao buscar documentos.");
      }
    }
    fetchDocuments();
  }, [selectedCollection]);

  // Atualiza o editor quando o documento é selecionado
  useEffect(() => {
    if (!selectedDocId) return;
    const doc = documents.find((d) => d._id === selectedDocId);
    if (doc) {
      const stringified = JSON.stringify(doc, null, 2);
      setEditorValue(stringified);
      setOriginalValue(stringified);
      setShowDiff(false);
    }
  }, [selectedDocId]);

  function handleCriarNovo() {
    const novo = { _id: `doc-${Date.now()}` };
    setDocuments(prev => [...prev, novo]);
    setSelectedDocId(novo._id);
    const stringified = JSON.stringify(novo, null, 2);
    setEditorValue(stringified);
    setOriginalValue(stringified);
    toast.success("Novo documento criado (não está ainda guardado).");
  }

  async function handleEliminar() {
    if (!selectedCollection || !selectedDocId) return;

    const confirmar = confirm("Tens a certeza que queres eliminar este documento?");
    if (!confirmar) return;

    if (selectedCollection === "alerts") {
      const id = documents.find(doc => doc._id === selectedDocId);
      const alerta = id.alertId;
      try {
        const res = await fetch(`/api/proxy?path=/api/db/collections/${selectedCollection}/${alerta}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error();

        setDocuments(prev => prev.filter(doc => doc._id !== selectedDocId));
        setSelectedDocId(null);
        toast.success("Documento eliminado.");
      } catch (error) {
        toast.error("Erro ao eliminar documento.");
        console.error(error);
      }

    } else {
      try {
        const res = await fetch(`/api/proxy?path=/api/db/collections/${selectedCollection}/${selectedDocId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error();

        setDocuments(prev => prev.filter(doc => doc._id !== selectedDocId));
        setSelectedDocId(null);
        toast.success("Documento eliminado.");
      } catch (error) {
        toast.error("Erro ao eliminar documento.");
        console.error(error);
      }
    }
  }


  async function handleGuardar() {
    if (!selectedCollection || !selectedDocId) return;
    try {
      const payload = [JSON.parse(editorValue)];
      const res = await fetch(`/api/proxy?path=/api/db/collections/${selectedCollection}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro na API");
      toast.success("Documento atualizado com sucesso.");
      setOriginalValue(editorValue);
      setShowDiff(false);
    } catch (error) {
      toast.error("Erro ao guardar documento.");
      console.error(error);
    }
  }

  function handleReverter() {
    setEditorValue(originalValue);
    toast.info("Revertido para versão anterior.");
    setShowDiff(false);
  }

  function handleReverAlteracoes() {
    try {
      const original = JSON.parse(originalValue);
      const atual = JSON.parse(editorValue);
      const alterado = JSON.stringify(atual, null, 2) !== JSON.stringify(original, null, 2);
      if (!alterado) {
        toast.info("Sem alterações.");
        setShowDiff(false);
        return;
      }
      setShowDiff(true);
    } catch {
      toast.error("JSON inválido.");
      setShowDiff(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Gestão da Base de Dados</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Seleciona a Collection</label>
        <Select onValueChange={(val) => setSelectedCollection(val)}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecionar Collection" />
          </SelectTrigger>
          <SelectContent>
            {collections.map((col) => (
              <SelectItem key={col} value={col}>{col}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Seleciona o Documento</label>
          <Select onValueChange={setSelectedDocId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Selecionar Documento" />
            </SelectTrigger>
            <SelectContent>
              {documents.map((doc) => (
                <SelectItem key={doc._id} value={doc._id}>{doc._id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedDocId && (
        <>
          <div className="mt-4">
            {showDiff ? (
              <DiffEditor
                height="500px"
                language="json"
                theme="vs-light"
                original={originalValue}
                modified={editorValue}
              />
            ) : (
              <CodeMirror
                value={editorValue}
                height="500px"
                theme={vscodeLight}
                extensions={[json()]}
                onChange={(val) => setEditorValue(val)}
              />
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <Button onClick={handleGuardar}>Guardar</Button>
            <Button variant="outline" onClick={handleReverAlteracoes}>
              {showDiff ? "Fechar Diff" : "Rever Alterações"}
            </Button>
            <Button variant="ghost" onClick={handleReverter}>Reverter</Button>
            <Button variant="destructive" onClick={handleEliminar}>Eliminar</Button>
            <Button variant="secondary" onClick={handleCriarNovo}>Criar Novo</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default DatabaseEditor;
