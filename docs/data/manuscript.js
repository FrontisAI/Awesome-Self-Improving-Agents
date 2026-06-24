window.MANUSCRIPT = {
  "title": "A Survey of Agents in the Era of Experience: Skills, Harness, and Self- to Meta-Evolution",
  "abstract": "In the Era of Experience, agentic AI is no longer defined only by what a model can infer from static data, but by how a deployed system accumulates, organizes, and reuses experience from interaction. This survey studies experience-driven improvement in deployed agentic AI systems. We focus on the runtime harness as the infrastructure that captures traces, routes actions, exposes feedback, and governs mutable state. Around this infrastructure, we review how experience becomes reusable skill, persistent memory, verifiable environment feedback, trainable model behavior, and meta-level control. We then identify the remaining barriers to reliable improvement, including longitudinal evaluation, transfer, verification, and safety governance. Making agents smarter after deployment is therefore a trace-to-capability problem: the field must learn how to capture experience, assign it to the right update surface, verify its value, and preserve control as the system changes.",
  "parts": [
    {
      "title": "Part I. Agents in the Era of Experience",
      "sections": [
        {
          "title": "Introduction",
          "file": "sections/introduction.tex",
          "subsections": [],
          "figures": []
        },
        {
          "title": "Harness as Experience Infrastructure",
          "file": "sections/taxonomy_overview.tex",
          "subsections": [
            {
              "title": "Runtime Adaptation Requires Experience Infrastructure",
              "children": []
            },
            {
              "title": "How Did We Get Here? From Task Loops to Runtime Systems",
              "children": [
                {
                  "kind": "paragraph",
                  "title": "Gen 1: task-bounded loops."
                },
                {
                  "kind": "paragraph",
                  "title": "Gen 2: persistent and reusable agent runtimes."
                },
                {
                  "kind": "paragraph",
                  "title": "Gen 3: productized and self-evolving runtime systems."
                }
              ]
            },
            {
              "title": "From Experience Destinations to Improvement Paths",
              "children": []
            },
            {
              "title": "Related Surveys",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "Agent Harness and System-level Surveys"
                },
                {
                  "kind": "subsubsection",
                  "title": "Harness-Component Surveys"
                },
                {
                  "kind": "subsubsection",
                  "title": "Evolution-Oriented Surveys"
                },
                {
                  "kind": "paragraph",
                  "title": "Our position."
                }
              ]
            }
          ],
          "figures": [
            {
              "source": "figure/harness.pdf",
              "caption": "Harness as experience infrastructure for deployed agents. The user"
            },
            {
              "source": "figure/timeline.pdf",
              "caption": "Historical progression from task-bounded loops to deployed"
            }
          ]
        }
      ]
    },
    {
      "title": "Part II. Runtime Infrastructure for Experience Reuse",
      "sections": [
        {
          "title": "Skills: Experience Becomes Reusable Procedure",
          "file": "sections/skill_lifecycle.tex",
          "subsections": [
            {
              "title": "Skill Formal Definition",
              "children": []
            },
            {
              "title": "A Three-Stage Lifecycle for External Skills",
              "children": []
            },
            {
              "title": "Skill Creation: From External Sources to Organized Library",
              "children": [
                {
                  "kind": "paragraph",
                  "title": "Expert and product-authored skills."
                },
                {
                  "kind": "paragraph",
                  "title": "Source-grounded skill construction."
                },
                {
                  "kind": "paragraph",
                  "title": "Offline trajectories and demonstrations."
                },
                {
                  "kind": "paragraph",
                  "title": "Library organization."
                }
              ]
            },
            {
              "title": "Skill Use: Retrieval, Composition, and Execution",
              "children": [
                {
                  "kind": "paragraph",
                  "title": "Routing, retrieval, and triggering."
                },
                {
                  "kind": "paragraph",
                  "title": "Composition."
                },
                {
                  "kind": "paragraph",
                  "title": "Execution under runtime constraints."
                }
              ]
            },
            {
              "title": "Skill Evolution: From Deployment Evidence to Library Updates",
              "children": [
                {
                  "kind": "paragraph",
                  "title": "Evidence discovery."
                },
                {
                  "kind": "paragraph",
                  "title": "Update operations."
                },
                {
                  "kind": "paragraph",
                  "title": "Validation and admission of updates."
                },
                {
                  "kind": "paragraph",
                  "title": "Summary."
                }
              ]
            }
          ],
          "figures": [
            {
              "source": "figure/skill.pdf",
              "caption": "External skill lifecycle used in this chapter. Skill Creation adds externally produced skills to the bank; Skill Use organizes, retrieves, composes, and executes the current bank; Skill Evolution converts compiled deployment experience into updates, producing an updated bank \\(S_{t_i^+}\\) for the next use cycle."
            }
          ]
        },
        {
          "title": "Memory: Experience Becomes Persistent State",
          "file": "sections/agent_memory.tex",
          "subsections": [
            {
              "title": "Agent Memory as Context-Mediated Persistence",
              "children": []
            },
            {
              "title": "Memory Representation: What Is Stored and How Is It Organized?",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "Memory Content Units"
                },
                {
                  "kind": "subsubsection",
                  "title": "Memory Organization Structures"
                }
              ]
            },
            {
              "title": "Memory Operations: How Is Memory Processed and Used?",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "Write and Admission"
                },
                {
                  "kind": "subsubsection",
                  "title": "Compression"
                },
                {
                  "kind": "subsubsection",
                  "title": "Consolidation"
                },
                {
                  "kind": "subsubsection",
                  "title": "Retrieval and Activation"
                },
                {
                  "kind": "subsubsection",
                  "title": "Update and Revision"
                }
              ]
            },
            {
              "title": "Memory Self-Evolution and the Next Frontier",
              "children": []
            }
          ],
          "figures": [
            {
              "source": "figure/memory.pdf",
              "caption": "Context-mediated memory management and evolution. Memory representations define what is stored, memory operations decide how stored information is written, compressed, retrieved, updated, and reintroduced into active context, and memory evolution captures how the agent improves memory content, memory policies, and meta-memory over time."
            }
          ]
        },
        {
          "title": "Environment: The Boundary of What Agents Can Experience",
          "file": "sections/agent_simulation_environment_and_execution_harness.tex",
          "subsections": [
            {
              "title": "Environment as Self-Improvement Infrastructure",
              "children": []
            },
            {
              "title": "Turning Software into Executable Environments",
              "children": []
            },
            {
              "title": "Protocolizing and Standardizing the Boundary",
              "children": []
            },
            {
              "title": "Executable and Reusable Is Still Not Learnable",
              "children": []
            }
          ],
          "figures": [
            {
              "source": "figure/Environment_Runtime_Adaptation_perfect_editable.pdf",
              "caption": "Environment as the ceiling of runtime adaptation. A deployed agent can"
            }
          ]
        }
      ]
    },
    {
      "title": "Part III. Consolidation and Coordination of Experience",
      "sections": [
        {
          "title": "RL and Continual Learning: Experience Becomes Parameter-side Consolidation",
          "file": "sections/agent_rl_and_continual_learning.tex",
          "subsections": [
            {
              "title": "Why the Parameter Path Matters",
              "children": []
            },
            {
              "title": "Pre-Deployment Training for Vertical Agent Capabilities",
              "children": [
                {
                  "kind": "paragraph",
                  "title": "Executable training substrates."
                },
                {
                  "kind": "paragraph",
                  "title": "SFT and RL on executable trajectories."
                },
                {
                  "kind": "paragraph",
                  "title": "Integrating vertical capabilities into generalist agents."
                }
              ]
            },
            {
              "title": "Pre-Deployment Training for Harness Functional Units",
              "children": [
                {
                  "kind": "paragraph",
                  "title": "Sub-agent orchestration and routing."
                },
                {
                  "kind": "paragraph",
                  "title": "Skill use and internalization."
                },
                {
                  "kind": "paragraph",
                  "title": "Memory access and experience reuse."
                }
              ]
            },
            {
              "title": "Post-Deployment Training from Agent Traces",
              "children": []
            },
            {
              "title": "Takeaways for Practitioners",
              "children": []
            }
          ],
          "figures": [
            {
              "source": "figure/rl.pdf",
              "caption": "Parameter-side learning for stronger agents after deployment."
            }
          ]
        },
        {
          "title": "Meta-Evolving Agents: Who Controls What to Evolve",
          "file": "sections/meta_evo_agent.tex",
          "subsections": [
            {
              "title": "Three Regimes of Post-Deployment Agent Evolution",
              "children": []
            },
            {
              "title": "TaskAgent Meta-Learning",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "TaskAgent-Internal Control over Execution Mechanisms"
                },
                {
                  "kind": "subsubsection",
                  "title": "TaskAgent-Internal Control over Improvement Strategies"
                }
              ]
            },
            {
              "title": "Meta-Evolving Agents",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "Meta-Layer Control over Execution Mechanisms"
                },
                {
                  "kind": "subsubsection",
                  "title": "Meta-Layer Control over Improvement Strategies"
                },
                {
                  "kind": "subsubsection",
                  "title": "Improving the Meta-Layer Itself"
                }
              ]
            }
          ],
          "figures": []
        }
      ]
    },
    {
      "title": "Part IV. Measurement, Safety, and Open Problems",
      "sections": [
        {
          "title": "Measuring Self-Improvement: What Current Benchmarks Still Miss",
          "file": "sections/evaluation.tex",
          "subsections": [
            {
              "title": "What Self-Improvement Evaluation Must Measure",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "Why Self-improvement Itself Must Be Evaluated"
                },
                {
                  "kind": "subsubsection",
                  "title": "From Continual-Learning Metrics to SI Targets"
                }
              ]
            },
            {
              "title": "The Current Benchmark Landscape",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "From Static Evaluation to SI-Oriented Benchmarking"
                },
                {
                  "kind": "subsubsection",
                  "title": "Benchmark Taxonomy and Coverage"
                },
                {
                  "kind": "paragraph",
                  "title": "Direct SI-Oriented Benchmarks"
                },
                {
                  "kind": "paragraph",
                  "title": "Dynamic and Deployment-Facing Benchmarks"
                },
                {
                  "kind": "paragraph",
                  "title": "Agentified Benchmark Platforms and Interoperability"
                },
                {
                  "kind": "paragraph",
                  "title": "Classical Benchmarks as Control Baselines"
                },
                {
                  "kind": "paragraph",
                  "title": "Summary of Requirement Coverage"
                },
                {
                  "kind": "paragraph",
                  "title": "A New Evidence and Reliability Layer"
                }
              ]
            },
            {
              "title": "SIP-Bench as a Protocol Layer",
              "children": []
            }
          ],
          "figures": [
            {
              "source": "figure/sip.pdf",
              "caption": "SIP-Bench protocol. The key idea is to evaluate one evolving agent across T0/T1/T2 checkpoints rather than only report a final score after adaptation."
            }
          ]
        },
        {
          "title": "Safety: Self-Improvement as a Moving Attack Surface",
          "file": "sections/safety.tex",
          "subsections": [
            {
              "title": "Why Self-Improvement Changes the Safety Calculus",
              "children": []
            },
            {
              "title": "Threat Models Across Mutable Harness Surfaces",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "Skill Supply-Chain Attacks"
                },
                {
                  "kind": "subsubsection",
                  "title": "Memory Poisoning and Memory Steering"
                },
                {
                  "kind": "subsubsection",
                  "title": "Workflow, Tool, and Protocol Exploits"
                },
                {
                  "kind": "subsubsection",
                  "title": "Reward and Feedback Manipulation"
                },
                {
                  "kind": "subsubsection",
                  "title": "Alignment Drift as an Organizing Lens"
                }
              ]
            },
            {
              "title": "Runtime Control for Self-Improving Agents",
              "children": [
                {
                  "kind": "subsubsection",
                  "title": "Pre-Deployment Alignment Remains Necessary"
                },
                {
                  "kind": "subsubsection",
                  "title": "Runtime Governance as the Practical Defense Layer"
                },
                {
                  "kind": "subsubsection",
                  "title": "Continuous Assurance and Re-Certification"
                },
                {
                  "kind": "subsubsection",
                  "title": "Limits of the Current Control Stack"
                }
              ]
            }
          ],
          "figures": []
        },
        {
          "title": "Open Problems",
          "file": "sections/conclusion_and_open_problems.tex",
          "subsections": [
            {
              "title": "Elicitation versus Acquisition",
              "children": []
            },
            {
              "title": "Consolidating External Experience into Parameters",
              "children": []
            },
            {
              "title": "Credit Assignment under Weak Feedback",
              "children": []
            },
            {
              "title": "Stability of Self-Generated Experience",
              "children": []
            },
            {
              "title": "Longitudinal Evaluation",
              "children": []
            },
            {
              "title": "Transfer across Model Versions",
              "children": []
            },
            {
              "title": "Coordination and Emergence in Multi-Agent Systems",
              "children": []
            },
            {
              "title": "Multimodal Experience Compilation",
              "children": []
            },
            {
              "title": "Safety under Post-Deployment Modification",
              "children": []
            }
          ],
          "figures": []
        }
      ]
    }
  ]
};
