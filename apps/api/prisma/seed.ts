import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nasa.com" },
    update: {},
    create: {
      name: "NASA Admin",
      email: "admin@nasa.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Hardcoded Missions
  await prisma.mission.createMany({
    data: [
      {
        title: "Apollo 11",
        description: "First manned mission to land on the Moon.",
        launchDate: new Date("1969-07-16"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/as11-40-5875/as11-40-5875~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Mars Rover Perseverance",
        description: "Exploration of Mars surface with the Perseverance rover.",
        launchDate: new Date("2020-07-30"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/PIA23723/PIA23723~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Hubble Space Telescope",
        description: "A space telescope that has revolutionized astronomy.",
        launchDate: new Date("1990-04-24"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/hubble-sees-a-stately-spiral-galaxy/hubble-sees-a-stately-spiral-galaxy~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Juno Mission to Jupiter",
        description: "A NASA space probe orbiting the planet Jupiter.",
        launchDate: new Date("2011-08-05"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/PIA14207/PIA14207~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Voyager 1",
        description: "A space probe launched by NASA to study the outer Solar System.",
        launchDate: new Date("1977-09-05"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/PIA17838/PIA17838~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "New Horizons",
        description: "An interplanetary space probe that flew by Pluto.",
        launchDate: new Date("2006-01-19"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/PIA19712/PIA19712~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Parker Solar Probe",
        description: "A NASA space probe launched to probe the outer corona of the Sun.",
        launchDate: new Date("2018-08-12"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20180811-PH-KLS01_0047/KSC-20180811-PH-KLS01_0047~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Cassini-Huygens",
        description: "A mission to study the planet Saturn and its system.",
        launchDate: new Date("1997-10-15"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/PIA08388/PIA08388~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Space Shuttle Columbia (STS-1)",
        description: "The first flight of the Space Shuttle program.",
        launchDate: new Date("1981-04-12"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/81_08431/81_08431~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Artemis I",
        description: "The first uncrewed test flight of NASA's Space Launch System.",
        launchDate: new Date("2022-11-16"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20221116-PH-FMX01_0022/KSC-20221116-PH-FMX01_0022~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Viking 1",
        description: "The first of two spacecraft sent to Mars as part of NASA's Viking program.",
        launchDate: new Date("1975-08-20"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/75-H-930/75-H-930~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Pioneer 10",
        description: "The first spacecraft to travel through the asteroid belt.",
        launchDate: new Date("1972-03-02"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/Pioneer_10_trajector/Pioneer_10_trajector~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Gemini 4",
        description: "The second crewed space flight in NASA's Project Gemini.",
        launchDate: new Date("1965-06-03"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/S65-30432/S65-30432~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Mercury-Atlas 6 (Friendship 7)",
        description: "The first American orbital spaceflight.",
        launchDate: new Date("1962-02-20"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/62-MA6-15/62-MA6-15~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Spitzer Space Telescope",
        description: "An infrared space telescope.",
        launchDate: new Date("2003-08-25"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/PIA03145/PIA03145~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Kepler Space Telescope",
        description: "A space observatory launched by NASA to discover Earth-size planets.",
        launchDate: new Date("2009-03-07"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-2009-1833/KSC-2009-1833~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Chandra X-ray Observatory",
        description: "A space telescope launched on STS-93 by NASA.",
        launchDate: new Date("1999-07-23"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/0201314/0201314~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "OSIRIS-REx",
        description: "A NASA asteroid-study and sample-return mission.",
        launchDate: new Date("2016-09-08"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20160908-PH_KLS01_0099/KSC-20160908-PH_KLS01_0099~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "InSight Lander",
        description: "A robotic lander designed to study the deep interior of the planet Mars.",
        launchDate: new Date("2018-05-05"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/PIA22759/PIA22759~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "TESS (Transiting Exoplanet Survey Satellite)",
        description: "A space telescope for NASA's Explorers program, designed to search for exoplanets.",
        launchDate: new Date("2018-04-18"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20180418-PH_KLS01_0045/KSC-20180418-PH_KLS01_0045~orig.jpg",
        createdBy: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  // Hardcoded Projects
  await prisma.project.createMany({
    data: [
      {
        title: "James Webb Space Telescope",
        description: "Next-generation space telescope.",
        startDate: new Date("2021-12-25"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/jwst-1st-deep-field-weic22001/jwst-1st-deep-field-weic22001~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "International Space Station",
        description: "A modular space station in low Earth orbit.",
        startDate: new Date("1998-11-20"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/iss064e002931/iss064e002931~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Gateway Program",
        description: "A planned small space station in lunar orbit intended to serve as a solar-powered communication hub.",
        startDate: new Date("2024-01-01"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/ARC-2019-GPN-0002-001/ARC-2019-GPN-0002-001~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Commercial Crew Program",
        description: "A partnership to develop and fly human space transportation systems.",
        startDate: new Date("2010-01-01"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20200530-PH-FMX01_0038/KSC-20200530-PH-FMX01_0038~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Mars Sample Return",
        description: "A proposed mission to return samples from the surface of Mars to Earth.",
        startDate: new Date("2026-01-01"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/PIA25195/PIA25195~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Europa Clipper",
        description: "An interplanetary mission to study Europa, an icy moon of Jupiter.",
        startDate: new Date("2024-10-10"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/PIA24228/PIA24228~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Roman Space Telescope",
        description: "A NASA infrared space observatory set to launch in the mid-2020s.",
        startDate: new Date("2027-01-01"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000407/GSFC_20171208_Archive_e000407~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Dragonfly Mission to Titan",
        description: "A planned spacecraft and mission that will send a robotic rotorcraft to Titan.",
        startDate: new Date("2027-01-01"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/PIA23152/PIA23152~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "SOFIA (Stratospheric Observatory for Infrared Astronomy)",
        description: "An airborne observatory based on a Boeing 747SP aircraft.",
        startDate: new Date("2010-01-01"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/ED14-0131-04/ED14-0131-04~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Orion Spacecraft",
        description: "A class of partially reusable space capsules to be used in NASA's human spaceflight programs.",
        startDate: new Date("2014-12-05"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20220816-PH-FMX01_0001/KSC-20220816-PH-FMX01_0001~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "Psyche Mission",
        description: "A planned orbiter mission that will explore the origin of planetary cores by studying the metallic asteroid of the same name.",
        startDate: new Date("2023-10-13"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/PIA25183/PIA25183~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "DAVINCI Mission",
        description: "Deep Atmosphere Venus Investigation of Noble gases, Chemistry, and Imaging.",
        startDate: new Date("2029-01-01"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000720/GSFC_20171208_Archive_e000720~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "VERITAS Mission",
        description: "Venus Emissivity, Radio Science, InSAR, Topography, and Spectroscopy.",
        startDate: new Date("2028-01-01"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/PIA24534/PIA24534~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "GLIMR (Geostationary Littoral Imaging and Monitoring Radiometer)",
        description: "A NASA mission to study coastal ecosystems.",
        startDate: new Date("2026-01-01"),
        status: "Planned",
        imageUrl: "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001714/GSFC_20171208_Archive_e001714~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "X-59 QueSST",
        description: "A planned experimental aircraft to study supersonic flight.",
        startDate: new Date("2022-01-01"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/AFRC2022-0120-006/AFRC2022-0120-006~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "HERA (Human Exploration Research Analog)",
        description: "A ground-based habitat to simulate long-duration space missions.",
        startDate: new Date("2014-01-01"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/jsc2022e069502/jsc2022e069502~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "CLPS (Commercial Lunar Payload Services)",
        description: "A program to contract transportation services able to send small robotic landers and rovers to the Moon's south pole region.",
        startDate: new Date("2018-01-01"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20240214-PH-FMX01_0001/KSC-20240214-PH-FMX01_0001~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "PACE (Plankton, Aerosol, Cloud, ocean Ecosystem)",
        description: "A NASA Earth-observing satellite mission that will continue and advance observations of global ocean color.",
        startDate: new Date("2024-02-08"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20240208-PH-FMX01_0012/KSC-20240208-PH-FMX01_0012~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "SWOT (Surface Water and Ocean Topography)",
        description: "A satellite mission to study the Earth's surface water.",
        startDate: new Date("2022-12-16"),
        status: "Active",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20221216-PH-FMX01_0001/KSC-20221216-PH-FMX01_0001~orig.jpg",
        createdBy: admin.id,
      },
      {
        title: "DART (Double Asteroid Redirection Test)",
        description: "A NASA space mission aimed at testing a method of planetary defense against near-Earth objects.",
        startDate: new Date("2021-11-24"),
        status: "Completed",
        imageUrl: "https://images-assets.nasa.gov/image/KSC-20211124-PH-FMX01_0001/KSC-20211124-PH-FMX01_0001~orig.jpg",
        createdBy: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log(" Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });