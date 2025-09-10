
// import cyclone from "../assets/cyclone.png";
import rainfall from "../assets/rain.png";
// import flood from "../assets/flood.png";
import earthquake from "../assets/earthquake.png";
import tsunami from "../assets/tsunami.png";
import landslide from "../assets/landslide.png";
import avalanche from "../assets/avalanche.png";
import drought from "../assets/drought.png";
import thunderstorm from "../assets/thunderstorm.png";
import wildfire from "../assets/wildfire.png";
import cyclone1 from "../assets/cyclone1.png";
import flood1 from "../assets/flood1.png";

const ALERTS = [
  { name: "Cyclone", icon: cyclone1, link: "https://mausam.imd.gov.in/imd_latest/contents/cyclone.php#." },
  { name: "Rainfall", icon: rainfall, link: "https://mausam.imd.gov.in/#." },
  { name: "Flood", icon: flood1, link: "https://mausam.imd.gov.in/imd_latest/contents/flash_flood.php#." },
  { name: "Earthquake", icon: earthquake, link: "https://riseq.seismo.gov.in/riseq/earthquake#." },
  { name: "Tsunami", icon:tsunami, link: "https://incois.gov.in/site/index.jsp#." },
  { name: "Landslide", icon:landslide, link: "https://www.gsi.gov.in/webcenter/portal/OCBIS/pageGeoInfo/pageLANDSLIDEHAZRD?_adf.ctrl-state=osayshkkp_63#." },
  { name: "Avalanche", icon: avalanche, link: "https://drdo.gov.in/drdo/avalanche-warning-bulletin" },
  { name: "Drought", icon:drought, link: "https://agriwelfare.gov.in/" },
  { name: "Thunderstorm", icon: thunderstorm, link: "https://srf.tropmet.res.in/srf/ts_prediction_system/index.php" },
  { name: "Wildfire", icon: wildfire, link: "https://fsiforestfire.gov.in/index.php" },
];
export default function AlertsHub() {
  return (
    <section className="mt-10">
      <h2 className="text-3xl font-bold mb-6">Alerts Hub</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {ALERTS.map((alert) => (
          <a
  key={alert.name}
  href={alert.link}
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer border border-gray-200"
>
  <img src={alert.icon} alt={alert.name} className="w-16 h-16 mb-2 object-contain" />
  <span className="font-medium text-gray-700">{alert.name}</span>
</a>
        ))}
      </div>
    </section>
  );
}
