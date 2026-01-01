"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { bookingSchema } from "@/lib/validators";
type ServiceOption = {
  id: string;
  slug: string;
  title: string;
};

type TeamOption = {
  id: string;
  name: string;
};
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type BookingFormValues = z.infer<typeof bookingSchema>;

type Slot = { startsAt: string; endsAt: string };

export default function BookingForm({
  services,
  team,
}: {
  services: ServiceOption[];
  team: TeamOption[];
}) {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("service");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const defaultService = useMemo(() => {
    if (!preselectedSlug) return services[0]?.id;
    const match = services.find((service) => service.slug === preselectedSlug);
    return match?.id ?? services[0]?.id;
  }, [preselectedSlug, services]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: defaultService ?? "",
      barberId: undefined,
      date: "",
      time: "",
      clientName: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const selectedDate = form.watch("date");
  const selectedServiceId = form.watch("serviceId");

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !selectedServiceId) {
        setSlots([]);
        return;
      }
      setIsLoadingSlots(true);
      const response = await fetch(
        `/api/booking/slots?date=${selectedDate}&serviceId=${selectedServiceId}`,
      );
      const data = await response.json();
      setSlots(data.slots ?? []);
      setIsLoadingSlots(false);
    };
    fetchSlots();
    form.setValue("time", "");
  }, [selectedDate, selectedServiceId, form]);

  const onSubmit = async (values: BookingFormValues) => {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const result = await response.json();
      window.location.href = `/booking/success?id=${result.id}`;
      return;
    }

    const error = await response.json();
    form.setError("root", { message: error.message ?? "Eroare la programare." });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-border/60 bg-card p-6">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serviciu</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteaza serviciu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barber (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Alege barber" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Fara preferinta</SelectItem>
                    {team.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("justify-start text-left", !field.value && "text-muted-foreground")}>
                        {field.value ? format(new Date(field.value), "dd MMM yyyy") : "Alege data"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? date.toISOString().slice(0, 10) : "")}
                      fromDate={new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ora</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingSlots ? "Se incarca..." : "Alege ora"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {slots.length ? (
                      slots.map((slot) => (
                        <SelectItem key={slot.startsAt} value={slot.startsAt}>
                          {slot.startsAt}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>
                        {isLoadingSlots ? "Se incarca..." : "Nu sunt sloturi disponibile"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6 rounded-3xl border border-border/60 bg-card p-6">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nume complet</FormLabel>
                <FormControl>
                  <Input placeholder="Nume si prenume" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="Telefon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observatii (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Preferinte, detalii" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root?.message ? (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          ) : null}

          <Button type="submit" className="w-full">
            Confirma programarea
          </Button>
        </div>
      </form>
    </Form>
  );
}
