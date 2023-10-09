"use client";

import CodeEditor from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { minify } from "@/lib/uglify";
import { produce } from "immer";
import { X } from "lucide-react";
import { nanoid } from "nanoid";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

interface Bookmarklet {
  uid: string;
  code: string;
  name: string;
  originCode: string;
}

export default function Page() {
  const [bookmarklets, setBookmarklets] = useLocalStorage<Bookmarklet[]>(
    "$bookmarklets$",
    []
  );
  const [code, setCode] = useLocalStorage<string>(
    "$code$",
    "// type your code...\r\n"
  );

  const [name, setName] = useState("bookmarklet");

  const [uglifiedCode, setUglifiedCode] = useState(code);

  const handleNameChanged: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setName(e.target.value);
    },
    []
  );

  const hanldeCodeChange = useCallback(
    (value: string) => {
      setCode(value);
    },
    [setCode]
  );

  const handleCreate = useCallback(() => {
    setBookmarklets(
      produce((draft) => {
        draft?.push({
          uid: nanoid(),
          code: `javascript:(function(){${encodeURIComponent(
            uglifiedCode || ""
          )}})()`,
          name,
          originCode: JSON.stringify(code),
        });
      })
    );
  }, [code, name, setBookmarklets, uglifiedCode]);

  const handleDelete = useCallback(
    (n: Bookmarklet) => {
      setBookmarklets(
        produce((draft) => {
          if (!draft) return;
          const idx = draft?.findIndex((item) => item.uid == n.uid);
          if (idx > -1) {
            draft?.splice(idx);
          }
        })
      );
    },
    [setBookmarklets]
  );

  useEffect(() => {
    const result = minify(code);
    if (result) {
      setUglifiedCode((result as any).code);
    }
  }, [code]);

  return (
    <div className="h-[calc(100vh_-_60px)]">
      <div className="container m-auto h-full flex">
        <div className="w-2/5 h-full">
          <CodeEditor code={code!} onChange={hanldeCodeChange} />
        </div>
        <div className="w-3/5 h-full p-10">
          <div className="mt-4">
            <Label htmlFor="content">Html Content:</Label>
            <div>
              <Textarea
                value={`<a href="javascript:(function(){${encodeURIComponent(
                  uglifiedCode || ""
                )}})()">${name}</a>`}
                readOnly
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="name">Name: </Label>
            <div className="flex space-x-2 mt-2">
              <Input
                className="w-[200px]"
                type="text"
                name="name"
                value={name}
                onChange={handleNameChanged}
              />

              <Button onClick={handleCreate}>Save Bookmarklet</Button>
            </div>
          </div>
          <div className="mt-10">
            <div>To drag and drop a bookmarklet to the bookmarks bar</div>
            <div className="flex gap-10">
              <span>Bookmarklet: </span>
              <a
                className="bg-teal-700 text-white text-base px-2 cursor-move rounded-sm shadow-sm"
                href={`javascript:(function(){${encodeURIComponent(
                  uglifiedCode || ""
                )}})()`}
              >
                {name || "bookmarklet"}
              </a>
            </div>
          </div>
          <div className="mt-10">
            <div>Your Bookmarklets:</div>
            <div className="mt-2">
              {!bookmarklets ||
                (bookmarklets.length == 0 && (
                  <div>
                    No bookmarklets. You can create a bookmarklet and save it.
                  </div>
                ))}
              {bookmarklets?.map((n) => {
                return (
                  <div className="flex space-x-2" key={n.uid}>
                    <a
                      className="bg-teal-700 text-white text-base px-2 cursor-move rounded-sm shadow-sm"
                      href={n.code}
                      data-code={n.originCode}
                      key={n.uid}
                    >
                      {n.name}
                    </a>
                    <X
                      className="cursor-pointer"
                      onClick={() => handleDelete(n)}
                    ></X>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
