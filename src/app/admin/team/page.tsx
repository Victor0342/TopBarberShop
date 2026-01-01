import { prisma } from "@/lib/db";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function AdminTeamPage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Echipa</h1>

      <form action={createTeamMember} className="grid gap-4 rounded-2xl border border-border/60 bg-card p-6 md:grid-cols-2">
        <h2 className="md:col-span-2 text-lg font-semibold">Adauga membru</h2>
        <Input name="name" placeholder="Nume" required />
        <Input name="role" placeholder="Rol" />
        <Input name="image" placeholder="Imagine (URL)" />
        <Input name="order" type="number" placeholder="Ordine" />
        <Input name="bio" placeholder="Bio" className="md:col-span-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4" />
          Activ
        </label>
        <Button type="submit" className="md:col-span-2">Adauga</Button>
      </form>

      <div className="space-y-4">
        {team.map((member) => (
          <div key={member.id} className="rounded-2xl border border-border/60 bg-card p-6">
            <form action={updateTeamMember} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={member.id} />
              <Input name="name" defaultValue={member.name} placeholder="Nume" required />
              <Input name="role" defaultValue={member.role ?? ""} placeholder="Rol" />
              <Input name="image" defaultValue={member.image ?? ""} placeholder="Imagine (URL)" />
              <Input name="order" type="number" defaultValue={member.order} placeholder="Ordine" />
              <Input name="bio" defaultValue={member.bio ?? ""} placeholder="Bio" className="md:col-span-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={member.active} className="h-4 w-4" />
                Activ
              </label>
              <div className="flex gap-3 md:col-span-2">
                <Button type="submit" variant="outline">Salveaza</Button>
                <Button formAction={deleteTeamMember} name="id" value={member.id} type="submit" variant="destructive">
                  Sterge
                </Button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
