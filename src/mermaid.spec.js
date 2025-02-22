import mermaid from './mermaid';
import flowDb from './diagrams/flowchart/flowDb';
import flowParser from './diagrams/flowchart/parser/flow';
import flowRenderer from './diagrams/flowchart/flowRenderer';
import Diagram from './Diagram';

const spyOn = jest.spyOn;

describe('when using mermaid and ', function () {
  describe('when detecting chart type ', function () {
    it('should not start rendering with mermaid.startOnLoad set to false', function () {
      mermaid.startOnLoad = false;
      document.body.innerHTML = '<div class="mermaid">graph TD;\na;</div>';
      spyOn(mermaid, 'init');
      mermaid.contentLoaded();
      expect(mermaid.init).not.toHaveBeenCalled();
    });

    it('should start rendering with both startOnLoad set', function () {
      mermaid.startOnLoad = true;
      document.body.innerHTML = '<div class="mermaid">graph TD;\na;</div>';
      spyOn(mermaid, 'init');
      mermaid.contentLoaded();
      expect(mermaid.init).toHaveBeenCalled();
    });

    it('should start rendering with mermaid.startOnLoad', function () {
      mermaid.startOnLoad = true;
      document.body.innerHTML = '<div class="mermaid">graph TD;\na;</div>';
      spyOn(mermaid, 'init');
      mermaid.contentLoaded();
      expect(mermaid.init).toHaveBeenCalled();
    });

    it('should start rendering as a default with no changes performed', function () {
      document.body.innerHTML = '<div class="mermaid">graph TD;\na;</div>';
      spyOn(mermaid, 'init');
      mermaid.contentLoaded();
      expect(mermaid.init).toHaveBeenCalled();
    });
  });

  describe('when calling addEdges ', function () {
    beforeEach(function () {
      flowParser.parser.yy = flowDb;
      flowDb.clear();
      flowDb.setGen('gen-2');
    });
    it('it should handle edges with text', function () {
      const diag = new Diagram('graph TD;A-->|text ex|B;');
      diag.db.getVertices();
      const edges = diag.db.getEdges();

      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B-');
          expect(options.arrowhead).toBe('normal');
          expect(options.label.match('text ex')).toBeTruthy();
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });

    it('should handle edges without text', function () {
      const diag = new Diagram('graph TD;A-->B;');
      diag.db.getVertices();
      const edges = diag.db.getEdges();

      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B-');
          expect(options.arrowhead).toBe('normal');
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });

    it('should handle open-ended edges', function () {
      const diag = new Diagram('graph TD;A---B;');
      diag.db.getVertices();
      const edges = diag.db.getEdges();

      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B-');
          expect(options.arrowhead).toBe('none');
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });

    it('should handle edges with styles defined', function () {
      const diag = new Diagram('graph TD;A---B; linkStyle 0 stroke:val1,stroke-width:val2;');
      diag.db.getVertices();
      const edges = diag.db.getEdges();

      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B-');
          expect(options.arrowhead).toBe('none');
          expect(options.style).toBe('stroke:val1;stroke-width:val2;fill:none;');
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });
    it('should handle edges with interpolation defined', function () {
      const diag = new Diagram('graph TD;A---B; linkStyle 0 interpolate basis');
      diag.db.getVertices();
      const edges = diag.db.getEdges();

      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B-');
          expect(options.arrowhead).toBe('none');
          expect(options.curve).toBe('basis'); // mocked as string
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });
    it('should handle edges with text and styles defined', function () {
      const diag = new Diagram(
        'graph TD;A---|the text|B; linkStyle 0 stroke:val1,stroke-width:val2;'
      );
      diag.db.getVertices();
      const edges = diag.db.getEdges();

      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B-');
          expect(options.arrowhead).toBe('none');
          expect(options.label.match('the text')).toBeTruthy();
          expect(options.style).toBe('stroke:val1;stroke-width:val2;fill:none;');
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });

    it('should set fill to "none" by default when handling edges', function () {
      const diag = new Diagram('graph TD;A---B; linkStyle 0 stroke:val1,stroke-width:val2;');
      diag.db.getVertices();
      const edges = diag.db.getEdges();

      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B');
          expect(options.arrowhead).toBe('none');
          expect(options.style).toBe('stroke:val1;stroke-width:val2;fill:none;');
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });

    it('should not set fill to none if fill is set in linkStyle', function () {
      const diag = new Diagram(
        'graph TD;A---B; linkStyle 0 stroke:val1,stroke-width:val2,fill:blue;'
      );
      diag.db.getVertices();
      const edges = diag.db.getEdges();
      const mockG = {
        setEdge: function (start, end, options) {
          expect(start).toContain('flowchart-A-');
          expect(end).toContain('flowchart-B-');
          expect(options.arrowhead).toBe('none');
          expect(options.style).toBe('stroke:val1;stroke-width:val2;fill:blue;');
        },
      };

      flowRenderer.addEdges(edges, mockG, diag);
    });
  });

  describe('checking validity of input ', function () {
    beforeEach(function () {
      flowParser.parser.yy = flowDb;
      flowDb.clear();
      flowDb.setGen('gen-2');
    });
    it('it should throw for an invalid definition', function () {
      expect(() => mermaid.parse('this is not a mermaid diagram definition')).toThrow();
    });

    it('it should not throw for a valid flow definition', function () {
      expect(() => mermaid.parse('graph TD;A--x|text including URL space|B;')).not.toThrow();
    });
    it('it should throw for an invalid flow definition', function () {
      expect(() => mermaid.parse('graph TQ;A--x|text including URL space|B;')).toThrow();
    });

    it('it should not throw for a valid sequenceDiagram definition', function () {
      const text =
        'sequenceDiagram\n' +
        'Alice->Bob: Hello Bob, how are you?\n\n' +
        '%% Comment\n' +
        'Note right of Bob: Bob thinks\n' +
        'alt isWell\n\n' +
        'Bob-->Alice: I am good thanks!\n' +
        'else isSick\n' +
        'Bob-->Alice: Feel sick...\n' +
        'end';
      expect(() => mermaid.parse(text)).not.toThrow();
    });

    it('it should throw for an invalid sequenceDiagram definition', function () {
      const text =
        'sequenceDiagram\n' +
        'Alice:->Bob: Hello Bob, how are you?\n\n' +
        '%% Comment\n' +
        'Note right of Bob: Bob thinks\n' +
        'alt isWell\n\n' +
        'Bob-->Alice: I am good thanks!\n' +
        'else isSick\n' +
        'Bob-->Alice: Feel sick...\n' +
        'end';
      expect(() => mermaid.parse(text)).toThrow();
    });
  });
});
