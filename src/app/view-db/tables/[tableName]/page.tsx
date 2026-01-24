"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function TableViewPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const tableName = params.tableName as string;
  const dbType = searchParams.get("db") || "remote";
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const pageSize = 10;

  useEffect(() => {
    loadData();
  }, [tableName, dbType, page]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}&page=${page}&pageSize=${pageSize}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));
        setError(errorData.error || `Ошибка ${response.status}`);
        setLoading(false);
        return;
      }
      
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data || []);
        setPagination(result.pagination || null);
      }
    } catch (err: any) {
      console.error("Ошибка при загрузке данных:", err);
      setError(err.message || "Ошибка при загрузке данных. Проверьте консоль для деталей.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту запись?")) {
      return;
    }

    try {
      // Для составных ключей передаем id как есть
      const response = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}&id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        loadData();
      }
    } catch (err) {
      alert("Ошибка при удалении записи");
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        setShowCreateModal(false);
        setFormData({});
        loadData();
      }
    } catch (err) {
      alert("Ошибка при создании записи");
      console.error(err);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData(record);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `/api/view-db/tables/${tableName}?db=${dbType}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        setShowEditModal(false);
        setEditingRecord(null);
        setFormData({});
        loadData();
      }
    } catch (err) {
      alert("Ошибка при обновлении записи");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">Загрузка...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
        <div className="w-full max-w-4xl rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
          <h2 className="mb-4 text-xl font-semibold text-red-600 dark:text-red-400">
            Ошибка при загрузке таблицы {tableName}
          </h2>
          <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/view-db/tables?db=${dbType}`)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Назад к списку таблиц
            </button>
            <button
              onClick={() => {
                setError(null);
                loadData();
              }}
              className="rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </main>
    );
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {tableName}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {dbType === "local" ? "Локальная БД" : "Рабочая БД"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/view-db/tables?db=${dbType}`)}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Назад
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Создать
            </button>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
            <p className="text-zinc-600 dark:text-zinc-400">Таблица пуста</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm dark:bg-zinc-950">
              <table className="w-full">
                <thead className="bg-zinc-100 dark:bg-zinc-900">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left text-sm font-medium text-zinc-900 dark:text-zinc-50"
                      >
                        {col}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {data.map((row, idx) => {
                    const rowId = row.id || (tableName === "TagOnTradeidea" ? `${row.tradeideaId}_${row.tagId}` : idx);
                    return (
                      <tr key={rowId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300"
                          >
                            {typeof row[col] === "object" && row[col] !== null
                              ? JSON.stringify(row[col])
                              : row[col] instanceof Date
                              ? row[col].toLocaleString()
                              : String(row[col] || "")}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(row)}
                              className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                            >
                              Изменить
                            </button>
                            <button
                              onClick={() => handleDelete(rowId)}
                              className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                            >
                              Удалить
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Страница {pagination.page} из {pagination.totalPages} (всего записей:{" "}
                  {pagination.total})
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                    disabled={page === pagination.totalPages}
                    className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    Вперед
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Модальное окно создания */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-950">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Создать запись
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {columns
                  .filter((col) => col !== "id" && col !== "createdAt" && col !== "updatedAt")
                  .map((col) => {
                    const value = formData[col];
                    const isDate = col.toLowerCase().includes("at") || col.toLowerCase().includes("date");
                    const isNumber = typeof value === "number" || col.toLowerCase().includes("id") || col === "value";
                    const isBoolean = typeof value === "boolean";
                    
                    return (
                      <div key={col}>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {col} {isDate && "(дата)"} {isNumber && "(число)"} {isBoolean && "(да/нет)"}
                        </label>
                        {isBoolean ? (
                          <select
                            value={value === true ? "true" : value === false ? "false" : ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [col]: e.target.value === "true" ? true : e.target.value === "false" ? false : undefined,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                          >
                            <option value="">Не указано</option>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                          </select>
                        ) : isDate ? (
                          <input
                            type="datetime-local"
                            value={value ? new Date(value).toISOString().slice(0, 16) : ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [col]: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                          />
                        ) : (
                          <input
                            type={isNumber ? "number" : "text"}
                            value={value !== undefined && value !== null ? String(value) : ""}
                            onChange={(e) => {
                              const newValue = isNumber
                                ? e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                                : e.target.value;
                              setFormData({ ...formData, [col]: newValue });
                            }}
                            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({});
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreate}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Создать
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно редактирования */}
        {showEditModal && editingRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-950">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Изменить запись
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {columns
                  .filter((col) => col !== "createdAt" && col !== "updatedAt")
                  .map((col) => {
                    const value = formData[col];
                    const isDate = col.toLowerCase().includes("at") || col.toLowerCase().includes("date");
                    const isNumber = typeof value === "number" || col.toLowerCase().includes("id") || col === "value";
                    const isBoolean = typeof value === "boolean";
                    const isId = col === "id" || (tableName === "TagOnTradeidea" && (col === "tradeideaId" || col === "tagId"));
                    
                    return (
                      <div key={col}>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {col} {isDate && "(дата)"} {isNumber && !isId && "(число)"} {isBoolean && "(да/нет)"}
                        </label>
                        {isBoolean ? (
                          <select
                            value={value === true ? "true" : value === false ? "false" : ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [col]: e.target.value === "true" ? true : e.target.value === "false" ? false : undefined,
                              })
                            }
                            disabled={isId}
                            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
                          >
                            <option value="">Не указано</option>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                          </select>
                        ) : isDate ? (
                          <input
                            type="datetime-local"
                            value={value ? new Date(value).toISOString().slice(0, 16) : ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [col]: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                              })
                            }
                            disabled={isId}
                            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
                          />
                        ) : (
                          <input
                            type={isNumber ? "number" : "text"}
                            value={value !== undefined && value !== null ? String(value) : ""}
                            onChange={(e) => {
                              const newValue = isNumber
                                ? e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value)
                                : e.target.value;
                              setFormData({ ...formData, [col]: newValue });
                            }}
                            disabled={isId}
                            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingRecord(null);
                    setFormData({});
                  }}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  Отмена
                </button>
                <button
                  onClick={handleUpdate}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
