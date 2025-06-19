"use client"

import { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"
import { createPost } from "@/lib/actions/posts"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-black hover:bg-gray-800 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Publicando...
        </>
      ) : (
        "Publicar Post"
      )}
    </Button>
  )
}

export default function CreatePostForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState("")
  const [state, formAction] = useActionState(createPost, null)

  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData)
    if (result?.success) {
      setIsOpen(false)
      setContent("")
      // Refresh the page to show the new post
      window.location.reload()
    }
  }

  const remainingChars = 5000 - content.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Novo Post</span>
          <span className="sm:hidden">Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Criar Novo Post</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-black">
              Conteúdo do Post
            </label>
            <Textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={5000}
              required
              className="border-gray-300 focus:border-black focus:ring-black resize-none text-sm"
              placeholder="Escreva seu comunicado aqui..."
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Máximo 5000 caracteres</span>
              <span className={remainingChars < 100 ? "text-red-500" : ""}>{remainingChars} restantes</span>
            </div>
          </div>

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  )
}
