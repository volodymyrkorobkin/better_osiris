import React from "react";
import { SafeAreaView, Text } from "react-native";
import { PieChart } from "react-native-svg-charts";
import styles from "./styles";
import Svg, { Path } from "react-native-svg";

function convertMinutesToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}u ${remainingMinutes}m`;
}

export default function MijnAfwerzigheid({ data }: { data: any }) {
  interface ArcParams {
    percentage: number;
    radius: number;
    offset: number;
  }

  const createArc = ({ percentage, radius, offset }: ArcParams): string => {
    const startAngle = (2 * Math.PI * offset) / 100;
    const endAngle = startAngle + (2 * Math.PI * percentage) / 100;

    const startX = radius + radius * Math.sin(startAngle);
    const startY = radius - radius * Math.cos(startAngle);
    const endX = radius + radius * Math.sin(endAngle);
    const endY = radius - radius * Math.cos(endAngle);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    return `M ${radius} ${radius} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  const chart = [
    {
      key: 1,
      value: data.afwezigheidOverzicht.minuten_aanwezig_totaal,
      svg: { fill: "#FF6384" },
    },
    {
      key: 2,
      value: data.afwezigheidOverzicht.minuten_geoorloofd_totaal,
      svg: { fill: "#36A2EB" },
    },
    {
      key: 3,
      value: data.afwezigheidOverzicht.minuten_ongeoorloofd_totaal,
      svg: { fill: "#FFCE56" },
    },
  ];

  const total =
    data.afwezigheidOverzicht.minuten_aanwezig_totaal +
    data.afwezigheidOverzicht.minuten_geoorloofd_totaal +
    data.afwezigheidOverzicht.minuten_ongeoorloofd_totaal;
  const percentageAanwezig = (data.afwezigheidOverzicht.minuten_aanwezig_totaal / total) * 100;
  const percentageAfwezig = (data.afwezigheidOverzicht.minuten_geoorloofd_totaal / total) * 100;
  const percentageAfwezigOng = (data.afwezigheidOverzicht.minuten_ongeoorloofd_totaal / total) * 100;

  return data === null ? (
    <Text>Loading...</Text>
  ) : (
    <SafeAreaView>
      <Text style={[styles.text, styles.h2]}>Aan- en afwezigheid</Text>
      <SafeAreaView style={[styles.row, styles.justifyBetween, styles.alignCenter, styles.baseMargin]}>
        <Svg width="150" height="150" viewBox="0 0 100 100">
          {/* Segment 1 */}
          <Path d={createArc({ percentage: percentageAanwezig, radius: 50, offset: 0 })} fill="#36A2EB" />
          {/* Segment 2 */}
          <Path d={createArc({ percentage: percentageAfwezig, radius: 50, offset: percentageAanwezig })} fill="#FFCE56" />
          {/* Segment 3 */}
          <Path
            d={createArc({ percentage: percentageAfwezigOng, radius: 50, offset: percentageAanwezig + percentageAfwezig })}
            fill="#FF6384"
          />
        </Svg>
        <SafeAreaView>
          <SafeAreaView style={[styles.row, styles.alignCenter, styles.baseMargin, styles.gap]}>
            <SafeAreaView style={[styles.kleur, { backgroundColor: "#36A2EB" }]}></SafeAreaView>
            <SafeAreaView>
              <Text style={[styles.text, styles.gray, styles.miniText]}>Aanwezig</Text>
              <Text style={styles.text}>
                {`${percentageAanwezig.toFixed(1)}% - ${convertMinutesToHours(data.afwezigheidOverzicht.minuten_aanwezig_totaal)}`}
              </Text>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView style={[styles.row, styles.alignCenter, styles.baseMargin, styles.gap]}>
            <SafeAreaView style={[styles.kleur, { backgroundColor: "#FFCE56" }]}></SafeAreaView>
            <SafeAreaView>
              <Text style={[styles.text, styles.gray, styles.miniText]}>Afwezig geoorloofd</Text>
              <Text style={styles.text}>
                {`${percentageAfwezig.toFixed(1)}% - ${convertMinutesToHours(data.afwezigheidOverzicht.minuten_geoorloofd_totaal)}`}
              </Text>
            </SafeAreaView>
          </SafeAreaView>

          <SafeAreaView style={[styles.row, styles.alignCenter, styles.baseMargin, styles.gap]}>
            <SafeAreaView style={[styles.kleur, { backgroundColor: "#FF6384" }]}></SafeAreaView>
            <SafeAreaView>
              <Text style={[styles.text, styles.gray, styles.miniText]}>Afwezig ongeoorloofd</Text>
              <Text style={styles.text}>
                {`${percentageAfwezigOng.toFixed(1)}% - ${convertMinutesToHours(data.afwezigheidOverzicht.minuten_ongeoorloofd_totaal)}`}
              </Text>
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaView>
  );
}
