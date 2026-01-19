import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export type RfpFormValues = {
  returnsPerYear: string;
  seasonality: string;
  sellsIntoRetailers: string;
  retailerProgram: string;
  currentReturnsHandling: string;
  returnsHandling: string;
  countries: string;
  warrantyProgram: string;
  warrantyInterest: string;
  subscriptionProgram: string;
  subscriptionInterest: string;
  salesSplitDtc: number;
  interestedChannels: string[];
  channelRestrictions: string;
  brandedDtc: string;
  brandedManagement: string;
  tradeIn: string;
  valuePriority: string;
  opportunityFeeling: string;
  excessInventoryChannel: string;
  excessInventoryNational: string;
  excessInventoryRegional: string;
  excessInventory: string;
  combineStrategy: string;
  name: string;
  email: string;
};

type QAPair = {
  question: string;
  answer: string;
};

type Section = {
  title: string;
  expertPerspective: string;
  qaPairs: QAPair[];
};

// Professional color palette matching RFP tool brand
const colors = {
  primary: "#2c2493", // Deep indigo/purple
  primaryAlt: "#3322c7", // Alternative purple
  accent: "#f36b3b", // Orange accent
  accentAlt: "#ff7c40", // Alternative orange
  bodyText: "#334155", // Dark gray for body
  bodyTextAlt: "#475569", // Alternative gray
  lightPurple: "#f3f1ff", // Light purple tint
  lightOrange: "#fff4ed", // Light orange tint
  muted: "#64748b", // Muted gray
  mutedAlt: "#94a3b8", // Alternative muted
};

const styles = StyleSheet.create({
  // Page styles
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.bodyText,
  },
  coverPage: {
    padding: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  contentPage: {
    paddingTop: 70,
    paddingBottom: 50,
    paddingLeft: 50,
    paddingRight: 50,
  },

  // Cover page styles
  coverTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 20,
    lineHeight: 1.3,
  },
  coverDate: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 30,
  },
  coverClient: {
    fontSize: 14,
    color: colors.bodyText,
    marginBottom: 40,
  },
  coverFooter: {
    fontSize: 9,
    color: colors.muted,
    marginTop: "auto",
    paddingTop: 20,
    borderTop: `1pt solid ${colors.mutedAlt}`,
  },

  // Header/Footer styles
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingBottom: 15,
    paddingLeft: 50,
    paddingRight: 50,
    borderBottom: `1pt solid ${colors.lightPurple}`,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.primary,
  },
  confidentialTag: {
    fontSize: 9,
    color: colors.muted,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 50,
    paddingRight: 50,
    borderTop: `1pt solid ${colors.lightPurple}`,
    flexDirection: "row",
    justifyContent: "center",
  },
  pageNumber: {
    fontSize: 9,
    color: colors.muted,
  },

  // Section styles
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 12,
  },
  expertPerspective: {
    fontSize: 10,
    fontStyle: "italic",
    color: colors.bodyTextAlt,
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.lightPurple,
    lineHeight: 1.5,
  },

  // Q&A two-column layout
  qaContainer: {
    marginBottom: 16,
    flexDirection: "row",
    minHeight: 20,
  },
  questionColumn: {
    width: "42%",
    paddingRight: 16,
  },
  answerColumn: {
    width: "58%",
    paddingLeft: 8,
  },
  questionText: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.bodyText,
    lineHeight: 1.4,
  },
  answerText: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.5,
  },

  // Advisory callout
  advisoryCallout: {
    marginTop: 40,
    padding: 20,
    backgroundColor: colors.lightOrange,
    borderRadius: 4,
  },
  advisoryTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.accent,
    marginBottom: 10,
  },
  advisoryText: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.6,
  },
});

// Format date for cover page
const formatDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format value for display
const formatValue = (value: string | number | string[] | undefined): string => {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "N/A";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return value;
};

// Build sections with Q&A pairs
const buildSections = (data: RfpFormValues): Section[] => [
  {
    title: "General Logistics",
    expertPerspective:
      "A robust reverse logistics strategy begins with understanding baseline operational context. Volume patterns, seasonality, and existing program infrastructure set the foundation for scalable recommerce solutions.",
    qaPairs: [
      {
        question: "Annual return volume",
        answer: formatValue(data.returnsPerYear),
      },
      {
        question: "Seasonality pattern",
        answer: formatValue(data.seasonality),
      },
      {
        question: "Sell into retailers",
        answer: formatValue(data.sellsIntoRetailers),
      },
      ...(data.sellsIntoRetailers === "Yes" && data.retailerProgram
        ? [
            {
              question: "Retailer program",
              answer: formatValue(data.retailerProgram),
            },
          ]
        : []),
      ...(data.currentReturnsHandling
        ? [
            {
              question: "Current returns handling",
              answer: formatValue(data.currentReturnsHandling),
            },
          ]
        : []),
      {
        question: "Returns handling process",
        answer: formatValue(data.returnsHandling),
      },
      {
        question: "Operating countries",
        answer: formatValue(data.countries),
      },
      {
        question: "Warranty program",
        answer: formatValue(data.warrantyProgram),
      },
      ...(data.warrantyProgram === "No" && data.warrantyInterest
        ? [
            {
              question: "Interest in warranty program",
              answer: formatValue(data.warrantyInterest),
            },
          ]
        : []),
      {
        question: "Subscription program",
        answer: formatValue(data.subscriptionProgram),
      },
      ...(data.subscriptionProgram === "No" && data.subscriptionInterest
        ? [
            {
              question: "Interest in subscription program",
              answer: formatValue(data.subscriptionInterest),
            },
          ]
        : []),
    ],
  },
  {
    title: "Recommerce Strategy",
    expertPerspective:
      "Effective recommerce requires channel diversification and clear ownership models. Understanding DTC vs. retail mix and channel preferences enables tailored strategies that maximize value recovery.",
    qaPairs: [
      {
        question: "Sales split: DTC vs. retail (%)",
        answer: `${formatValue(data.salesSplitDtc)}% DTC`,
      },
      {
        question: "Interested recommerce channels",
        answer: formatValue(data.interestedChannels),
      },
      ...(data.channelRestrictions
        ? [
            {
              question: "Channel restrictions",
              answer: formatValue(data.channelRestrictions),
            },
          ]
        : []),
      {
        question: "Branded second-hand DTC program interest",
        answer: formatValue(data.brandedDtc),
      },
      ...(data.brandedDtc === "Yes" && data.brandedManagement
        ? [
            {
              question: "Preferred management approach",
              answer: formatValue(data.brandedManagement),
            },
          ]
        : []),
      {
        question: "Trade-in program interest",
        answer: formatValue(data.tradeIn),
      },
    ],
  },
  {
    title: "Value & Opportunity",
    expertPerspective:
      "Strategic value drivers and opportunity assessment reveal optimization potential. Understanding current coverage gaps and inventory constraints enables comprehensive reverse logistics pipeline optimization.",
    qaPairs: [
      {
        question: "Top value driver",
        answer: formatValue(data.valuePriority),
      },
      {
        question: "Current opportunity capture assessment",
        answer: formatValue(data.opportunityFeeling),
      },
      ...(data.excessInventoryChannel
        ? [
            {
              question: "Excess inventory sales channel",
              answer: formatValue(data.excessInventoryChannel),
            },
            ...(data.excessInventoryChannel === "Off-Priced Retailers (National)" &&
            data.excessInventoryNational
              ? [
                  {
                    question: "National retailers",
                    answer: formatValue(data.excessInventoryNational),
                  },
                ]
              : []),
            ...(data.excessInventoryChannel === "Off-Priced Retailers (Regional)" &&
            data.excessInventoryRegional
              ? [
                  {
                    question: "Regional retailers",
                    answer: formatValue(data.excessInventoryRegional),
                  },
                ]
              : []),
          ]
        : []),
      ...(data.excessInventory && !data.excessInventoryChannel
        ? [
            {
              question: "Excess inventory handling",
              answer: formatValue(data.excessInventory),
            },
          ]
        : []),
      {
        question: "Combine inventory & returns strategy",
        answer: formatValue(data.combineStrategy),
      },
    ],
  },
];

// Header component (fixed on every page except cover)
const PageHeader = () => (
  <View style={styles.header} fixed>
    <Text style={styles.logoText}>Nok Recommerce</Text>
    <Text style={styles.confidentialTag}>Confidential - RFP Strategy</Text>
  </View>
);

// Footer component (appears on every page with fixed prop)
const PageFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.pageNumber}>Nok Recommerce - Confidential RFP Document</Text>
  </View>
);

// Cover page component
const CoverPage = ({ clientName }: { clientName: string }) => (
  <Page size="A4" style={styles.coverPage}>
    <View>
      <Text style={styles.coverTitle}>
        Reverse Logistics & Recommerce Strategy RFP
      </Text>
      <Text style={styles.coverDate}>{formatDate()}</Text>
      {clientName && (
        <Text style={styles.coverClient}>Prepared for {clientName}</Text>
      )}
    </View>
    <View>
      <Text style={styles.coverFooter}>Prepared by Nok Recommerce</Text>
    </View>
  </Page>
);

// Q&A row component - prevent question/answer from splitting
const QARow = ({ question, answer }: QAPair) => (
  <View style={styles.qaContainer} wrap={false}>
    <View style={styles.questionColumn}>
      <Text style={styles.questionText}>{question}</Text>
    </View>
    <View style={styles.answerColumn}>
      <Text style={styles.answerText}>{answer}</Text>
    </View>
  </View>
);

// Section component
const SectionContent = ({ section }: { section: Section }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{section.title}</Text>
    <Text style={styles.expertPerspective}>{section.expertPerspective}</Text>
    {section.qaPairs.map((qa, index) => (
      <QARow key={index} question={qa.question} answer={qa.answer} />
    ))}
  </View>
);

// Advisory callout component
const AdvisoryCallout = () => (
  <View style={styles.advisoryCallout}>
    <Text style={styles.advisoryTitle}>Strategic Advisory Consultation</Text>
    <Text style={styles.advisoryText}>
      This RFP was generated based on your specific operational needs. Maddy
      from the Nok Recommerce team will reach out to walk you through this
      document, explain the logic behind these recommendations, and discuss how
      we can help optimize your reverse logistics pipeline.
    </Text>
  </View>
);

// Main PDF component
export function RfpPdf({ data }: { data: RfpFormValues }) {
  const sections = buildSections(data);

  return (
    <Document>
      {/* Cover Page */}
      <CoverPage clientName={data.name || ""} />

      {/* Content Pages - @react-pdf/renderer automatically handles page breaks */}
      <Page size="A4" style={styles.contentPage}>
        <PageHeader />
        <PageFooter />
        
        {sections.map((section) => (
          <SectionContent key={section.title} section={section} />
        ))}
        
        <AdvisoryCallout />
      </Page>
    </Document>
  );
}
