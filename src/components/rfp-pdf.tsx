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
  number: number;
  expertPerspective?: string;
  qaPairs: QAPair[];
  insight?: string;
};

// Professional Slate/Navy color palette
const colors = {
  primary: "#1e293b", // slate-800
  primaryAlt: "#334155", // slate-700
  bodyText: "#334155", // slate-700
  bodyTextAlt: "#475569", // slate-600
  muted: "#64748b", // slate-500
  mutedAlt: "#94a3b8", // slate-400
  border: "#EEEEEE", // Light gray for borders
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
    paddingLeft: 40,
    paddingRight: 40,
  },

  // Cover page styles
  coverTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 15,
    lineHeight: 1.3,
  },
  coverLogo: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 30,
  },
  coverDate: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 25,
  },
  coverClient: {
    fontSize: 12,
    color: colors.bodyText,
    marginBottom: 30,
  },
  executiveSummary: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.7,
    marginTop: 20,
    textAlign: "justify",
  },
  coverFooter: {
    fontSize: 9,
    color: colors.muted,
    marginTop: "auto",
    paddingTop: 20,
    borderTop: `1pt solid ${colors.border}`,
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
    borderBottom: `1pt solid ${colors.border}`,
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
    borderTop: `1pt solid ${colors.border}`,
    flexDirection: "row",
    justifyContent: "center",
  },
  pageNumber: {
    fontSize: 9,
    color: colors.muted,
  },
  confidentialFooter: {
    fontSize: 9,
    color: colors.muted,
  },

  // Section styles
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
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
    paddingTop: 12,
    paddingBottom: 12,
    borderLeft: `3pt solid ${colors.primary}`,
    lineHeight: 1.6,
  },

  // Q&A two-column table layout
  qaContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 5,
    minHeight: 20,
  },
  questionColumn: {
    width: "40%",
    paddingRight: 12,
  },
  answerColumn: {
    width: "60%",
    paddingLeft: 8,
  },
  questionText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.bodyText,
    lineHeight: 1.5,
  },
  answerText: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.6,
  },
  // Insight text
  insightText: {
    fontSize: 9,
    fontStyle: "italic",
    color: colors.bodyTextAlt,
    marginTop: 16,
    paddingTop: 8,
    borderTop: `1pt solid ${colors.border}`,
    lineHeight: 1.6,
  },

  // Strategic Considerations section
  strategicSection: {
    marginTop: 30,
  },
  strategicIntro: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.7,
    marginBottom: 16,
  },
  nextStepItem: {
    fontSize: 10,
    color: colors.bodyText,
    lineHeight: 1.7,
    marginBottom: 8,
    paddingLeft: 8,
  },
  strategicFooter: {
    fontSize: 9,
    fontStyle: "italic",
    color: colors.bodyTextAlt,
    marginTop: 20,
    paddingTop: 12,
    borderTop: `1pt solid ${colors.border}`,
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

// Expand acronyms
const expandAcronym = (value: string): string => {
  if (value.includes("DIF") && !value.includes("Destroy in Field")) {
    return value.replace(/DIF/g, "Destroy in Field (DIF)");
  }
  if (value.includes("RTV") && !value.includes("Return to Vendor")) {
    return value.replace(/RTV/g, "Return to Vendor (RTV)");
  }
  if (value.includes("ZVR") && !value.includes("Zero Value Return")) {
    return value.replace(/ZVR/g, "Zero Value Return (ZVR)");
  }
  return value;
};

// Format value for display
const formatValue = (value: string | number | string[] | undefined): string => {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }
  if (Array.isArray(value)) {
    const formatted = value.length > 0 ? value.join(", ") : "N/A";
    return expandAcronym(formatted);
  }
  if (typeof value === "number") {
    return value.toString();
  }
  return expandAcronym(value);
};

// Generate insight based on section data
const generateInsight = (sectionNumber: number, data: RfpFormValues): string | undefined => {
  switch (sectionNumber) {
    case 1: // Company & Operational Overview
      const returnsNum = parseInt(data.returnsPerYear.replace(/,/g, "")) || 0;
      if (returnsNum > 100000) {
        return "Note: High annual return volumes suggest that small gains in processing efficiency will yield significant enterprise-level cost savings.";
      }
      break;
    case 2: // Reverse Logistics & Returns Operations
      if (data.sellsIntoRetailers === "Yes") {
        return "Note: Retailer partnerships require aligned return handling processes to maintain channel relationships.";
      }
      break;
    case 3: // Recommerce & Channel Strategy
      if (data.salesSplitDtc > 50) {
        return "Note: High DTC mix creates opportunity for direct consumer relationships through recommerce channels.";
      }
      break;
    case 4: // Value Drivers & Opportunity Assessment
      if (data.opportunityFeeling === "No") {
        return "Note: Recognizing gaps in current opportunity capture indicates readiness for strategic enhancement.";
      }
      break;
  }
  return undefined;
};

// Build sections with Q&A pairs
const buildSections = (data: RfpFormValues): Section[] => {
  const section1: Section = {
    title: "Company & Operational Overview",
    number: 1,
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
    insight: generateInsight(1, data),
  };

  const section2: Section = {
    title: "Reverse Logistics & Returns Operations",
    number: 2,
    expertPerspective:
      "Effective reverse logistics operations require clear processes for handling returns across channels. Understanding current return handling methods and retailer relationships enables optimization of the returns pipeline.",
    qaPairs: [
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
    ],
    insight: generateInsight(2, data),
  };

  const section3: Section = {
    title: "Recommerce & Channel Strategy",
    number: 3,
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
    insight: generateInsight(3, data),
  };

  const section4: Section = {
    title: "Value Drivers & Opportunity Assessment",
    number: 4,
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
    insight: generateInsight(4, data),
  };

  return [section1, section2, section3, section4];
};

// Header component (fixed on every page except cover)
const PageHeader = () => (
  <View style={styles.header} fixed>
    <Text style={styles.logoText}>Nok Recommerce</Text>
    <Text style={styles.confidentialTag}>Confidential RFP Document</Text>
  </View>
);

// Footer component (appears on every page with fixed prop)
const PageFooter = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.confidentialFooter}>Confidential RFP Document</Text>
  </View>
);

// Cover page component
const CoverPage = ({ clientName }: { clientName: string }) => (
  <Page size="A4" style={styles.coverPage}>
    <View>
      <Text style={styles.coverLogo}>Nok Recommerce</Text>
      <Text style={styles.coverTitle}>
        Reverse Logistics Strategic Assessment
      </Text>
      <Text style={styles.coverDate}>{formatDate()}</Text>
      {clientName && (
        <Text style={styles.coverClient}>Prepared for {clientName}</Text>
      )}
      <Text style={styles.executiveSummary}>
        This document was developed to establish a structured understanding of
        current operations, strategic priorities, and areas of opportunity, and
        to support informed decision-making around program design and
        optimization.{"\n\n"}
        The information captured within reflects a combination of operational
        inputs and strategic considerations intended to surface efficiencies,
        identify value creation opportunities, and highlight potential paths for
        improvement. By organizing these inputs across key functional and
        commercial dimensions, this document provides a foundation for
        evaluating both near-term initiatives and longer-term program evolution.{"\n\n"}
        The purpose of this assessment is not to prescribe a single solution,
        but to enable a thoughtful, collaborative discussion around priorities,
        constraints, and success metrics. The insights generated are designed to
        inform a tailored approach that aligns operational execution with
        broader business objectives.{"\n\n"}
        The next step is a review and validation of the information presented,
        followed by a working session to explore implications, refine
        assumptions, and determine appropriate next actions. This process is
        intended to support scalable, data-informed decisions and to ensure that
        any recommended initiatives are practical, aligned, and positioned for
        long-term success.
      </Text>
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
    <Text style={styles.sectionTitle}>
      {section.number}. {section.title}
    </Text>
    {section.expertPerspective && (
      <Text style={styles.expertPerspective}>{section.expertPerspective}</Text>
    )}
    {section.qaPairs.map((qa, index) => (
      <QARow key={index} question={qa.question} answer={qa.answer} />
    ))}
    {section.insight && (
      <Text style={styles.insightText}>{section.insight}</Text>
    )}
  </View>
);

// Strategic Considerations section component
const StrategicConsiderationsSection = () => (
  <View style={styles.strategicSection}>
    <Text style={styles.sectionTitle}>
      5. Strategic Considerations & Next Steps
    </Text>
    <Text style={styles.strategicIntro}>
      This document serves as a foundation for evaluating program design and
      strategic direction.
    </Text>
    <View style={{ marginTop: 12, marginBottom: 12 }}>
      <Text style={styles.nextStepItem}>
        1. Internal Review & Validation
      </Text>
      <Text style={styles.nextStepItem}>
        2. Data Gap Analysis
      </Text>
      <Text style={styles.nextStepItem}>
        3. Strategic Alignment Session
      </Text>
    </View>
    <Text style={styles.strategicFooter}>
      A Nok expert (Maddy) will reach out to facilitate a review of these
      findings and explore alignment with broader business objectives.
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
          <SectionContent key={section.number} section={section} />
        ))}
        
        <StrategicConsiderationsSection />
      </Page>
    </Document>
  );
}
