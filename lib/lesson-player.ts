// =====================================================================
// Lesson player mock data — mirrors the production LMS player
// (course → module → sections → lessons), with the downloadable files
// attached to each lesson so they can be shown next to it.
// =====================================================================

export type ResourceKind = "pkt" | "pdf" | "zip" | "txt";

export interface LessonResource {
  id: string;
  name: string;          // file name as shown to the student
  kind: ResourceKind;
  sizeKb: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration?: string;     // "10:58"; omitted for reviews / quizzes
  type: "video" | "lab" | "review";
  completed: boolean;
  resources: LessonResource[];
}

export interface LessonSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface PlayerModule {
  courseName: string;
  moduleName: string;
  about: string;
  sections: LessonSection[];
}

const pkt = (id: string, name: string, sizeKb = 64): LessonResource => ({ id, name, kind: "pkt", sizeKb });
const pdf = (id: string, name: string, sizeKb = 820): LessonResource => ({ id, name, kind: "pdf", sizeKb });

export const PLAYER_MODULE: PlayerModule = {
  courseName: "Full Stack Network Associate",
  moduleName: "IP Routing in LANs & WANs",
  about:
    "In this module we'll look at how routers make forwarding decisions, configure static and dynamic routing, and compare the major routing protocols — RIP, EIGRP, OSPF and BGP — with hands-on Packet Tracer labs along the way. #LevelUp",
  sections: [
    {
      id: "intro",
      title: "Introduction",
      lessons: [{ id: "welcome", title: "Welcome", duration: "1:00", type: "video", completed: true, resources: [] }],
    },
    {
      id: "routing",
      title: "Routing",
      lessons: [
        {
          id: "how-routers-route",
          title: "How Routers Route",
          duration: "10:40",
          type: "video",
          completed: true,
          resources: [pdf("hrr-slides", "Slides - How Routers Route.pdf", 2140)],
        },
        {
          id: "lab-configuring-ips",
          title: "Lab: Configuring IPs on a Router",
          duration: "10:58",
          type: "lab",
          completed: true,
          resources: [
            pkt("cfg-ips-pkt", "Configuring IPs on a Router.pkt", 58),
            pdf("cfg-ips-guide", "Lab Guide - Configuring IPs on a Router.pdf", 1320),
          ],
        },
        { id: "static-routing", title: "Static Routing", duration: "6:49", type: "video", completed: true, resources: [] },
        {
          id: "lab-static-routing",
          title: "Lab: Static Routing",
          duration: "13:26",
          type: "lab",
          completed: false,
          resources: [
            pkt("static-pkt", "Static Routing.pkt", 71),
            pdf("static-guide", "Lab Guide - Static Routing.pdf", 1180),
            pkt("static-solution", "Static Routing - Solution.pkt", 74),
          ],
        },
        { id: "dynamic-routing", title: "Dynamic Routing", duration: "12:56", type: "video", completed: false, resources: [] },
        { id: "routing-review", title: "Routing Review", type: "review", completed: false, resources: [] },
      ],
    },
    {
      id: "routing-protocols",
      title: "Routing Protocols",
      lessons: [
        { id: "rip", title: "RIP", duration: "4:04", type: "video", completed: false, resources: [] },
        {
          id: "lab-ripv2",
          title: "Lab: RIPv2",
          duration: "18:07",
          type: "lab",
          completed: false,
          resources: [pkt("ripv2-pkt", "RIPv2.pkt", 66), pdf("ripv2-guide", "Lab Guide - RIPv2.pdf", 990)],
        },
        {
          id: "lab-advanced-rip",
          title: "Lab: Advanced RIP (Optional)",
          duration: "29:10",
          type: "lab",
          completed: false,
          resources: [
            pkt("adv-rip-pkt", "Advanced RIP.pkt", 88),
            pdf("adv-rip-guide", "Lab Guide - Advanced RIP.pdf", 1450),
          ],
        },
        { id: "eigrp", title: "EIGRP", duration: "19:00", type: "video", completed: false, resources: [] },
        {
          id: "ospf",
          title: "OSPF",
          duration: "6:04",
          type: "video",
          completed: false,
          resources: [pdf("ospf-cheatsheet", "OSPF Cheat Sheet.pdf", 410)],
        },
        { id: "bgp", title: "BGP", duration: "8:16", type: "video", completed: false, resources: [] },
        { id: "routing-loops", title: "Routing Loops", duration: "14:54", type: "video", completed: false, resources: [] },
        { id: "admin-distance", title: "Administrative Distance", duration: "4:43", type: "video", completed: false, resources: [] },
        { id: "protocols-review", title: "Routing Protocols Review", type: "review", completed: false, resources: [] },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Routing Concepts",
      lessons: [
        {
          id: "route-summarization",
          title: "Route Summarization",
          duration: "11:32",
          type: "video",
          completed: false,
          resources: [
            { id: "summ-worksheet", name: "Summarization Worksheet.zip", kind: "zip", sizeKb: 240 },
          ],
        },
        { id: "longest-match", title: "Longest Prefix Match", duration: "7:18", type: "video", completed: false, resources: [] },
        { id: "core-review", title: "Core Routing Concepts Review", type: "review", completed: false, resources: [] },
      ],
    },
  ],
};

/** Lesson the demo opens on: a lab, so its files are visible straight away. */
export const PLAYER_START_LESSON = "lab-static-routing";

export function formatFileSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}
